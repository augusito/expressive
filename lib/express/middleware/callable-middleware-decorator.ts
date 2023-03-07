import type { HttpMiddleware } from '../types';

export class CallableMiddlewareDecorator implements HttpMiddleware {
  constructor(private readonly callable: Function) {}

  public process(req: any, res: any, next: any) {
    return this.callable(req, res, next);
  }
}
