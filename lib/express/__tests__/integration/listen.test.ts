import * as express from 'express';
import { ExpressServer } from '../../express-server';

describe('ExpressServer (listen)', () => {
  let expressServer: ExpressServer;

  beforeEach(() => {
    expressServer = new ExpressServer(express());
    expressServer.initHttpServer({});
  });

  afterEach(async () => {
    await expressServer.close();
  });

  it('should resolve with httpServer on success', () => {
    const response = expressServer.listen(3000);
    expect(response).toEqual(expressServer.getHttpServer());
  });
});
