import * as express from 'express';
import { Module } from '../common/types';
import { IContainer, Provider } from '../container/types';
import { ExpressServer } from './express-server';

export class ExpressModule implements Module {
  register(): { providers: Provider[] } {
    return {
      providers: [
        {
          provide: ExpressServer.name,
          useFactory: (container: IContainer) => {
            return new ExpressServer(express());
          },
        },
      ],
    };
  }
}
