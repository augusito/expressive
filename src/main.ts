import { Application } from '../lib/core/application';
import { container } from './container';
import { defineRoutes } from './routes';

async function main() {
  const app = container.get<Application>(Application.name);
  await app.listen(3000);
  defineRoutes(app.getServer());
  console.log(`Listening on port: ${await app.getUrl()}`);
}
main();
