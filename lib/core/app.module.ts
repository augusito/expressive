import { Module, Server } from '../common/types';
import { isFunction } from '../common/utils/lang.util';
import { IContainer, Provider } from '../container/types';
import { ExpressServer } from '../express/express-server';
import { Application } from './application';
import { HookCollector } from './hooks/hook-collector';
import { HookContainer } from './hooks/hook-container';
import { HookFactory } from './hooks/hook-factory';
import { TaskExecutor } from './task/task-executor';

export class AppModule implements Module {
  register(): { providers: Provider[] } {
    return {
      providers: [
        {
          provide: HookContainer.name,
          useFactory: (container: IContainer) => {
            return new HookContainer(container);
          },
        },
        {
          provide: HookFactory.name,
          useFactory: (container: IContainer) => {
            return new HookFactory(container.get(HookContainer.name));
          },
        },
        {
          provide: HookCollector.name,
          useFactory: (container: IContainer) => {
            const config: any = container.has('config')
              ? container.get('config')
              : {};
            return new HookCollector(
              container.get(HookFactory.name),
              config?.hooks,
            );
          },
        },
        {
          provide: Application.name,
          useFactory: (container: IContainer) => {
            const server = container.get<Server>(ExpressServer.name);
            const hooks = container.get<HookCollector>(HookCollector.name);
            const instance = new Application(server, hooks);
            const target = this.createTarget(instance);
            return this.createAdapterProxy(target, server);
          },
        },
      ],
    };
  }

  private createTarget<T>(instance: T): T {
    return this.createProxy(instance);
  }

  private createProxy(target: any) {
    const proxy = this.createTaskProxy();
    return new Proxy(target, {
      get: proxy,
      set: proxy,
    });
  }

  private createTaskProxy() {
    return (receiver: Record<string, any>, prop: string) => {
      if (!(prop in receiver)) {
        return;
      }
      if (isFunction(receiver[prop])) {
        return this.createTaskExecutor(receiver, prop);
      }
      return receiver[prop];
    };
  }

  private createAdapterProxy(app: Application, server: Server) {
    const proxy = new Proxy(app, {
      get: (receiver: Record<string, any>, prop: string) => {
        const mapToProxy = (result: unknown) => {
          return result instanceof Promise
            ? result.then(mapToProxy)
            : result instanceof Application
            ? proxy
            : result;
        };

        if (!(prop in receiver) && prop in server) {
          return (...args: unknown[]) => {
            const result = this.createTaskExecutor(server, prop)(...args);
            return mapToProxy(result);
          };
        }
        if (isFunction(receiver[prop])) {
          return (...args: unknown[]) => {
            const result = receiver[prop](...args);
            return mapToProxy(result);
          };
        }
        return receiver[prop];
      },
    });
    return proxy;
  }

  private createTaskExecutor(
    receiver: Record<string, any>,
    prop: string,
  ): Function {
    return (...args: unknown[]) => {
      let result: unknown;
      TaskExecutor.execute(() => {
        result = receiver[prop](...args);
      });

      return result;
    };
  }
}
