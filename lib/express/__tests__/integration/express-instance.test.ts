import * as express from 'express';
import * as request from 'supertest';
import { ExpressServer } from '../../express-server';

describe('ExpressServer (express instance)', () => {
  let server: express.Application;

  beforeEach(async () => {
    const adapter = new ExpressServer(express());
    server = adapter.getInstance();
  });

  it(`/GET`, () => {
    server.get('/hello', (req: express.Request, res: express.Response) => {
      return res.send('Hello world!');
    });

    return request(server).get('/hello').expect(200).expect('Hello world!');
  });
});
