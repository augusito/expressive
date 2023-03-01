import type { Module } from '../common/types';
import type { IContainer, Provider } from '../container/types';
import { ExpressServer } from '../express/express-server';
import { Hellohandler } from './hello.handler';
import { HelloService } from './hello.service';

export class HelloModule implements Module {
  register(): { providers: Provider[] } {
    return {
      providers: [
        {
          provide: HelloService.name,
          useClass: HelloService,
        },
        {
          provide: Hellohandler.name,
          useFactory: (container: IContainer) => {
            return new Hellohandler(
              container.get<HelloService>(HelloService.name),
            );
          },
        },
      ],
    };
  }

  registerRoutes(server: ExpressServer) {
    server.get('/hello', Hellohandler.name);
  }
}
