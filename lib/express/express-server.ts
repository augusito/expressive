import * as express from 'express';
import * as http from 'http';
import * as https from 'https';
import * as net from 'net';
import { Server } from '../common/types';

export class ExpressServer implements Server {
  private httpServer: http.Server | https.Server;

  constructor(private readonly instance: express.Application) {}

  getInstance(): express.Application {
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
}
