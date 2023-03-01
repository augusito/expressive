import * as express from 'express';
import * as request from 'supertest';
import { Container } from '../../../container/container';
import { ExpressModule } from '../../express.module';
import { ExpressServer } from '../../express-server';

describe('ExpressServer (express instance)', () => {
  let expressApp: express.Application;

  beforeEach(() => {
    const module = new ExpressModule();
    const providers = module.register()?.['providers'] ?? [];
    const container = new Container(providers);
    const server = container.get<ExpressServer>(ExpressServer.name);
    expressApp = server.getInstance();
  });

  it(`/GET`, () => {
    expressApp.get('/hello', (req: express.Request, res: express.Response) => {
      return res.send('Hello world!');
    });

    return request(expressApp).get('/hello').expect(200).expect('Hello world!');
  });
});
