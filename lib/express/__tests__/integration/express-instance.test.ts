import * as express from 'express';
import * as request from 'supertest';
import { ExpressServer } from '../../express-server';

describe('ExpressServer (express instance)', () => {
  let expressApp: express.Application;

  beforeEach(async () => {
    const adapter = new ExpressServer(express());
    expressApp = adapter.getInstance();
  });

  it(`/GET`, () => {
    expressApp.get('/hello', (req: express.Request, res: express.Response) => {
      return res.send('Hello world!');
    });

    return request(expressApp).get('/hello').expect(200).expect('Hello world!');
  });
});
