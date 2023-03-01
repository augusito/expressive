import { platform } from 'os';
import { isFunction, isString } from '../common/utils/lang.util';
import { Server } from '../common/types';
import { HookCollector } from './hooks/hook-collector';

export class Application {
  private httpServer: any;
  private isInitialized = false;
  private isListening = false;

  constructor(
    private readonly server: Server,
    private readonly hooks: HookCollector,
    private readonly options: any = {},
  ) {
    this.registerHttpServer();
  }

  public async init(): Promise<this> {
    if (this.isInitialized) {
      return this;
    }
    await this.hooks.addStartupHook();
    this.isInitialized = true;
    return this;
  }

  public getServer<T extends Server>(): T {
    return this.server as T;
  }

  public getHttpServer() {
    return this.httpServer;
  }

  public registerHttpServer() {
    this.httpServer = this.createServer();
  }

  public createServer<T = any>(): T {
    this.server.initHttpServer(this.options);
    return this.server.getHttpServer() as T;
  }

  public async listen(port: number | string): Promise<any>;
  public async listen(port: number | string, hostname: string): Promise<any>;
  public async listen(port: number | string, ...args: any[]): Promise<any> {
    !this.isInitialized && (await this.init());

    return new Promise((resolve, reject) => {
      const errorHandler = (e: any) => {
        console.error(e?.toString?.());
        reject(e);
      };
      this.httpServer.once('error', errorHandler);

      const isCallbackInOriginalArgs = isFunction(args[args.length - 1]);
      const listenFnArgs = isCallbackInOriginalArgs
        ? args.slice(0, args.length - 1)
        : args;

      this.server.listen(
        port,
        ...listenFnArgs,
        (...originalCallbackArgs: unknown[]) => {
          if (originalCallbackArgs[0] instanceof Error) {
            return reject(originalCallbackArgs[0]);
          }

          const address = this.httpServer.address();
          if (address) {
            this.httpServer.removeListener('error', errorHandler);
            this.isListening = true;
            resolve(this.httpServer);
          }
          if (isCallbackInOriginalArgs) {
            args[args.length - 1](...originalCallbackArgs);
          }
        },
      );
    });
  }

  public async getUrl(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.isListening) {
        console.error(
          'app.listen() needs to be called before calling app.getUrl()',
        );
        reject('app.listen() needs to be called before calling app.getUrl()');
        return;
      }
      const address = this.httpServer.address();
      resolve(this.formatAddress(address));
    });
  }

  public async close(signal?: string): Promise<void> {
    await this.hooks.addBeforeShutdownHook(signal);
    await this.dispose();
    await this.hooks.addShutdownHook(signal);
  }

  private async dispose(): Promise<void> {
    this.server && (await this.server.close());
  }

  private formatAddress(address: any): string {
    if (isString(address)) {
      if (platform() === 'win32') {
        return address;
      }
      const basePath = encodeURIComponent(address);
      return `${this.getProtocol()}+unix://${basePath}`;
    }

    let host = this.host();
    if (address && address.family === 'IPv6') {
      if (host === '::') {
        host = '[::1]';
      } else {
        host = `[${host}]`;
      }
    } else if (host === '0.0.0.0') {
      host = '127.0.0.1';
    }

    return `${this.getProtocol()}://${host}:${address.port}`;
  }

  private host(): string | undefined {
    const address = this.httpServer.address();
    if (isString(address)) {
      return undefined;
    }
    return address && address.address;
  }

  private getProtocol(): 'http' | 'https' {
    return this.options && this.options.httpsOptions ? 'https' : 'http';
  }
}
