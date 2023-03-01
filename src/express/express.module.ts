import * as express from 'express';
import { Module } from '../../src/common/types';
import { IContainer, Provider } from '../container/types';
import { ExpressServer } from './express-server';
import { MiddlewareContainer } from './middleware/middleware-container';
import { MiddlewareFactory } from './middleware/middleware-factory';

export class ExpressModule implements Module {
  register(): { providers: Provider[] } {
    return {
      providers: [
        {
          provide: MiddlewareContainer.name,
          useFactory: (container: IContainer) => {
            return new MiddlewareContainer(container);
          },
        },
        {
          provide: MiddlewareFactory.name,
          useFactory: (container: IContainer) => {
            const conatiner = container.get<MiddlewareContainer>(
              MiddlewareContainer.name,
            );
            return new MiddlewareFactory(conatiner);
          },
        },
        {
          provide: ExpressServer.name,
          useFactory: (container: IContainer) => {
            return new ExpressServer(
              express(),
              container.get<MiddlewareFactory>(MiddlewareFactory.name),
            );
          },
        },
      ],
    };
  }
}
