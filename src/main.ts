import { Application } from './core/application';
import { container } from './config/container';
import { definePipeline } from './config/pipeline';
import { defineRoutes } from './config/routes';
import { ExpressServer } from './express/express-server';

async function main() {
  const app = container.get<Application & ExpressServer>(Application.name);
  await app.listen(3000);
  definePipeline(app, container);
  defineRoutes(app, container);
  console.log(`Listening on port: ${await app.getUrl()}`);
}
main();
