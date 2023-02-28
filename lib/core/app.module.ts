import { Module, Server } from '../common/types';
import { IContainer, Provider } from '../container/types';
import { ExpressServer } from '../express/express-server';
import { Application } from './application';

export class AppModule implements Module {
  register(): { providers: Provider[] } {
    return {
      providers: [
        {
          provide: Application.name,
          useFactory: (container: IContainer) => {
            return new Application(container.get<Server>(ExpressServer.name));
          },
        },
      ],
    };
  }
}
