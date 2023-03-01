import type { Type } from '../../src/common/types';

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
