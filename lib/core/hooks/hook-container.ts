import type { Type } from '../../common/types';
import { isFunction } from '../../common/utils/lang.util';
import type { IContainer, ProviderToken } from '../../container/types';

export class HookContainer implements IContainer {
  constructor(private readonly container: IContainer) {}

  get<T>(token: ProviderToken | Type<any>): T {
    if (!this.has(token)) {
      throw new Error('Token is not registered');
    }
    if (this.container.has(token as ProviderToken)) {
      return this.container.get(token as ProviderToken);
    }

    return token as T;
  }

  has(token: ProviderToken | Type): boolean {
    if (this.container.has(token as ProviderToken)) {
      return true;
    }

    return isFunction(token);
  }
}
