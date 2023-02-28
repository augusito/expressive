import type { Module } from '../../lib/common/types';
import type { IContainer, Provider } from '../../lib/container/types';
import { ExpressServer } from '../../lib/express/express-server';
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
