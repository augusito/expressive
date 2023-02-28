import { Application } from '../lib/core/application';
import { container } from './container';
import { definePipeline } from './pipeline';
import { defineRoutes } from './routes';

async function main() {
  const app = container.get<Application>(Application.name);
  await app.listen(3000);
  definePipeline(app.getServer(), container);
  defineRoutes(app.getServer(), container);
  console.log(`Listening on port: ${await app.getUrl()}`);
}
main();
