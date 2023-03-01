import type { Type } from '../../../src/common/types';
import {
  isFunction,
  isString,
  isSymbol,
  isUndefined,
} from '../../../src/common/utils/lang.util';
import type { HttpHandler, HttpMiddleware } from '../types';
import { CallableErrorMiddlewareDecorator } from './callable-error-middleware-decorator';
import { CallableMiddlewareDecorator } from './callable-middleware-decorator';
import { HttpHandlerMiddleware } from './hem-handler-middleware';
import type { MiddlewareContainer } from './middleware-container';

export class MiddlewareFactory {
  constructor(private readonly container: MiddlewareContainer) {}

  public prepare(middleware: any): HttpMiddleware | HttpMiddleware[] {
    if (Array.isArray(middleware)) {
      return this.pipeline(middleware);
    }

    if (middleware?.process) {
      return middleware;
    }

    if (middleware?.handle) {
      return this.handler(middleware);
    }

    if (this.isMiddlewareClass(middleware)) {
      const instance = new middleware();

      if (isFunction(instance.handle)) {
        return this.handler(instance);
      }

      if (isUndefined(instance.process)) {
        throw new Error('Invalid middleware');
      }

      return instance;
    }

    if (isFunction(middleware)) {
      return this.callable(middleware);
    }

    if (!isString(middleware) && !isSymbol(middleware)) {
      throw new Error('Invalid middleware');
    }

    return this.lazy(middleware);
  }

  public callable(middleware: Function): HttpMiddleware {
    if (middleware.length > 3) {
      return new CallableErrorMiddlewareDecorator(middleware);
    }
    return new CallableMiddlewareDecorator(middleware);
  }

  public handler(middleware: HttpHandler): HttpMiddleware {
    return new HttpHandlerMiddleware(middleware);
  }

  public lazy(middleware: string | symbol): HttpMiddleware {
    return this.container.get<HttpMiddleware>(middleware);
  }

  public pipeline(middleware: any[]): HttpMiddleware[] {
    return middleware.map((mid) => this.prepare(mid)) as HttpMiddleware[];
  }

  private isMiddlewareClass(middleware: any): middleware is Type<any> {
    const middlewareStr = middleware.toString();
    if (middlewareStr.substring(0, 5) === 'class') {
      return true;
    }
    return false;
  }
}
