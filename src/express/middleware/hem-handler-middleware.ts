import type { HttpHandler, HttpMiddleware } from '../types';

export class HttpHandlerMiddleware implements HttpMiddleware {
  constructor(private readonly handler: HttpHandler) {}

  public process(req: any, res: any, next: any) {
    return this.handler.handle(req, res, next);
  }
}
