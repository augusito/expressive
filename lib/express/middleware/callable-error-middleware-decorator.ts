import type { HttpMiddleware } from '../types';

export class CallableErrorMiddlewareDecorator implements HttpMiddleware {
  constructor(private readonly callable: Function) {}

  public process(err: any, req: any, res: any, next?: any) {
    return this.callable(err, req, res, next);
  }
}
