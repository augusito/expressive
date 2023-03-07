import * as express from 'express';
import type { IContainer } from '../lib/container/types';
import type { ExpressServer } from '../lib/express/express-server';
import { HelloModule } from '../app/hello/hello.module';

export function defineRoutes(app: ExpressServer, container: IContainer) {
  app.get('/', (req: express.Request, res: express.Response) => {
    res.send({ connected: true });
  });

  // Hello routes
  new HelloModule().registerRoutes(app);
}
