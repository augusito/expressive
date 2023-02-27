import { uid } from 'uid';
import { isFunction, isObject, isUndefined } from './utils/lang.util';
import { Module, Type } from './types';

export type ConfigProvider = Module | Type<Module> | Function;

export class ConfigAggregator {
  private config: Record<string, any>;

  constructor(providers: ConfigProvider[] = []) {
    this.config = this.loadConfigFromProviders(providers);
  }

  public getMergedConfig(): Record<string, any> {
    return this.config;
  }

  private loadConfigFromProviders(
    providers: ConfigProvider[],
  ): Record<string, any> {
    const mergedConfig: Record<string, any> = {};
    for (const provider of providers) {
      const instance = this.resolveProvider(provider);
      if (this.isConfigProvider(instance)) {
        this.mergeConfig(mergedConfig, instance.register());
      }
    }
    return mergedConfig;
  }

  private mergeConfig(
    target: Record<string, any> = {},
    source: Array<{} | undefined | null>,
  ): Record<string, any> {
    for (const key in source) {
      if (!isUndefined(source[key])) {
        let obj = target[key];
        const value = source[key];
        if (Array.isArray(value)) {
          obj = isUndefined(obj) ? [] : obj;
          target[key] = obj.concat(value);
        } else if (isObject(obj) && isObject(value)) {
          target[key] = { ...obj, ...value };
        } else {
          target[key] = value;
        }
      }
    }
    return target;
  }

  private resolveProvider(provider: ConfigProvider): ConfigProvider {
    if (isObject(provider)) {
      return provider;
    }
    if (this.isProviderClass(provider)) {
      const typeProvider = provider as Type<Module>;
      return new typeProvider();
    }
    if (!isFunction(provider)) {
      throw new Error('Invalid config provider');
    }
    const metatype = this.mapToClass(provider);
    return new metatype();
  }

  private isProviderClass(provider: ConfigProvider): provider is Type<Module> {
    const providerStr = provider.toString();
    if (providerStr.substring(0, 5) === 'class') {
      return true;
    }
    return false;
  }

  private isConfigProvider(provider: ConfigProvider): provider is Module {
    return isFunction((provider as Module).register);
  }

  private mapToClass<T extends Function>(instance: T): Type<Module> {
    return this.assignToken(
      class {
        register = (...params: unknown[]) => {
          return instance(...params);
        };
      },
    );
  }

  private assignToken(metatype: Type<Module>, token = uid(21)): Type<Module> {
    Object.defineProperty(metatype, 'name', { value: token });
    return metatype;
  }
}
