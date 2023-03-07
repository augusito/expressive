import type { Type } from '../../common/types';
import { isFunction } from '../../common/utils/lang.util';
import type { IContainer, ProviderToken } from '../../container/types';
import { HttpHandlerMiddleware } from './hem-handler-middleware';

export class MiddlewareContainer implements IContainer {
  constructor(private readonly container: IContainer) {}

  get<T>(token: ProviderToken | Type<any>): T {
    if (!this.has(token)) {
      throw new Error('Missing dependency middleware provider');
    }

    let middleware: any;

    if (this.container.has(token as ProviderToken)) {
      middleware = this.container.get(token as ProviderToken);
    } else {
      const metatype = token as Type<any>;
      middleware = new metatype();
    }

    if (middleware.handle) {
      middleware = new HttpHandlerMiddleware(middleware);
    }

    if (!middleware.process) {
      throw new Error('Invalid middleware');
    }

    return middleware as T;
  }

  has(token: ProviderToken | Type): boolean {
    if (this.container.has(token as ProviderToken)) {
      return true;
    }

    return isFunction(token);
  }
}
