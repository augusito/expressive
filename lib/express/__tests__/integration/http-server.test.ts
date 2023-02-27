import * as express from 'express';
import * as http from 'http';
import * as request from 'supertest';
import { ExpressServer } from '../../express-server';

describe('ExpressServer (http server)', () => {
  let expressServer: ExpressServer;
  let httpServer: http.Server;
  let expressApp: express.Application;

  beforeEach(() => {
    expressServer = new ExpressServer(express());
    expressServer.initHttpServer();
    expressApp = expressServer.getInstance();
    httpServer = expressServer.getHttpServer();
  });

  afterEach(async () => {
    await expressServer.close();
  });

  it(`/GET`, () => {
    expressApp.get('/hello', (req: express.Request, res: express.Response) => {
      return res.send('Hello world!');
    });

    return request(httpServer).get('/hello').expect(200).expect('Hello world!');
  });
});
