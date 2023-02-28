import * as express from 'express';
import * as http from 'http';
import * as request from 'supertest';
import { Container } from '../../../container/container';
import { ExpressModule } from '../../express.module';
import { ExpressServer } from '../../express-server';

describe('ExpressServer (http server)', () => {
  let server: ExpressServer;
  let httpServer: http.Server;
  let expressApp: express.Application;

  beforeEach(() => {
    const module = new ExpressModule();
    const providers = module.register()?.['providers'] ?? [];
    const container = new Container(providers);
    server = container.get<ExpressServer>(ExpressServer.name);
    server.initHttpServer({});
    server.initHttpServer({});
    expressApp = server.getInstance();
    httpServer = server.getHttpServer();
  });

  afterEach(async () => {
    await server.close();
  });

  it(`/GET`, () => {
    expressApp.get('/hello', (req: express.Request, res: express.Response) => {
      return res.send('Hello world!');
    });

    return request(httpServer).get('/hello').expect(200).expect('Hello world!');
  });
});
