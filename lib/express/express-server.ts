import * as express from 'express';
import * as http from 'http';
import * as https from 'https';
import * as net from 'net';
import type { Server } from '../common/types';
import type { MiddlewareFactory } from './middleware/middleware-factory';
import { HandlerArgument, PathArgument } from './types';

export class ExpressServer implements Server {
  private httpServer: http.Server | https.Server;

  constructor(
    private readonly instance: express.Application,
    private readonly factory: MiddlewareFactory,
  ) {}

  public use(...args: any[]) {
    return this.instance.use(...args);
  }

  public pipe(
    handlerOrPath: PathArgument | HandlerArgument,
    handler?: HandlerArgument,
  ) {
    handler = handler ?? (handlerOrPath as HandlerArgument);
    const path = handler === handlerOrPath ? '/' : handlerOrPath;
    return this.use(path, this.bindHandler(handler));
  }

  public get(path: PathArgument, handler: HandlerArgument) {
    return this.instance.get(path, this.bindHandler(handler));
  }

  public post(path: PathArgument, handler: HandlerArgument) {
    return this.instance.post(path, this.bindHandler(handler));
  }

  public head(path: PathArgument, handler: HandlerArgument) {
    return this.instance.head(path, this.bindHandler(handler));
  }

  public delete(path: PathArgument, handler: HandlerArgument) {
    return this.instance.delete(path, this.bindHandler(handler));
  }

  public put(path: PathArgument, handler: HandlerArgument) {
    return this.instance.put(path, this.bindHandler(handler));
  }

  public patch(path: PathArgument, handler: HandlerArgument) {
    return this.instance.patch(path, this.bindHandler(handler));
  }

  public all(path: PathArgument, handler: HandlerArgument) {
    return this.instance.all(path, this.bindHandler(handler));
  }

  public options(path: PathArgument, handler: HandlerArgument) {
    return this.instance.options(path, this.bindHandler(handler));
  }

  public getInstance(): express.Application {
    return this.instance;
  }

  public getHttpServer(): http.Server | https.Server {
    return this.httpServer;
  }

  public listen(port: string | number, callback?: () => void): net.Server;
  public listen(
    port: string | number,
    hostname: string,
    callback?: () => void,
  ): net.Server;
  public listen(port: any, ...args: any[]): net.Server {
    return this.httpServer.listen(port, ...args);
  }

  public initHttpServer(options: any): void {
    const isHttpsEnabled = options && options.httpsOptions;
    if (isHttpsEnabled) {
      this.httpServer = https.createServer(
        options.httpsOptions,
        this.getInstance(),
      );
      return;
    } else {
      this.httpServer = http.createServer(this.getInstance());
    }
  }

  public close() {
    if (!this.httpServer) {
      return undefined;
    }
    return new Promise((resolve) => this.httpServer.close(resolve));
  }

  public bindHandler(handler: HandlerArgument) {
    let middleware = this.factory.prepare(handler);
    if (!Array.isArray(middleware)) {
      middleware = [middleware];
    }
    return middleware.map((mid: any) => {
      return mid.process.bind(mid);
    });
  }
}
