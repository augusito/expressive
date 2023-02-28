import {
  json as bodyParserJson,
  urlencoded as bodyParserUrlencoded,
} from 'body-parser';
import { ExpressServer } from '../lib/express/express-server';

export function definePepiline(server: ExpressServer) {
  server.pipe(bodyParserUrlencoded({ extended: false }));
  server.pipe(bodyParserJson());
}
