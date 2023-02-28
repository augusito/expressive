import { ExpressServer } from '../lib/express/express-server';

export function defineRoutes(server: ExpressServer) {
  server.getInstance().get('/', (req, res) => {
    res.send('Hello world!');
  });
}
