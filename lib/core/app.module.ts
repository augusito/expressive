import { Module, Server } from '../common/types';
import { IContainer, Provider } from '../container/types';
import { ExpressServer } from '../express/express-server';
import { Application } from './application';
import { HookCollector } from './hooks/hook-collector';
import { HookContainer } from './hooks/hook-container';
import { HookFactory } from './hooks/hook-factory';

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
            return new Application(
              container.get<Server>(ExpressServer.name),
              container.get<HookCollector>(HookCollector.name),
            );
          },
        },
      ],
    };
  }
}
