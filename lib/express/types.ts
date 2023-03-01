import * as express from 'express';
import * as http from 'http';
import * as https from 'https';
import * as net from 'net';
import type { Type } from '../common/types';
import type { IApplication } from '../core/types';

export type PathArgument = string | RegExp | (string | RegExp)[];

export type ErrorHandler<TRequest = any, TResponse = any> = (
  err: any,
  req: TRequest,
  res: TResponse,
  next?: Function,
) => any;

export type RequestHandler<TRequest = any, TResponse = any> = (
  req: TRequest,
  res: TResponse,
  next?: Function,
) => any;

export interface HttpHandler<TRequest = any, TResponse = any> {
  handle(req: TRequest, res: TResponse, next?: Function): any;
}

export interface HttpMiddleware<TRequest = any, TResponse = any> {
  process(req: TRequest, res: TResponse, next?: Function): any;
  process(err: any, req: TRequest, res: TResponse, next?: Function): any;
}

export type Handler =
  | ErrorHandler
  | HttpHandler
  | HttpMiddleware
  | RequestHandler
  | Type<any>
  | Function
  | string
  | Symbol;

export type HandlerArgument = Handler | Handler[];

export interface ExpressApplication extends IApplication {
  use(...args: any[]): express.Application;
  pipe(
    handlerOrPath: PathArgument | HandlerArgument,
    handler?: HandlerArgument,
  ): express.Application;
  get(path: PathArgument, handler: HandlerArgument): express.Application;
  post(path: PathArgument, handler: HandlerArgument): express.Application;
  head(path: PathArgument, handler: HandlerArgument): express.Application;
  delete(path: PathArgument, handler: HandlerArgument): express.Application;
  put(path: PathArgument, handler: HandlerArgument): express.Application;
  patch(path: PathArgument, handler: HandlerArgument): express.Application;
  all(path: PathArgument, handler: HandlerArgument): express.Application;
  options(path: PathArgument, handler: HandlerArgument): express.Application;
  getInstance(): express.Application;
  getHttpServer(): http.Server | https.Server;
  listen(port: number | string, callback?: () => void): Promise<net.Server>;
  listen(
    port: number | string,
    hostname: string,
    callback?: () => void,
  ): Promise<net.Server>;
}
