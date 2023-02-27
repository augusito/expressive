import * as express from 'express';
import { ExpressServer } from '../../express-server';

test('should return instance of ExpressServer', () => {
  const expressApp = express();
  const server = new ExpressServer(expressApp);
  expect(server).toBeInstanceOf(ExpressServer);
  expect(server.getInstance()).toEqual(expressApp);
});
