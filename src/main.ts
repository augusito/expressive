import { Application } from '../lib/core/application';
import { container } from './container';
import { definePepiline } from './pipeline';
import { defineRoutes } from './routes';

async function main() {
  const app = container.get<Application>(Application.name);
  await app.listen(3000);
  definePepiline(app.getServer());
  defineRoutes(app.getServer());
  console.log(`Listening on port: ${await app.getUrl()}`);
}
main();
