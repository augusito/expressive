import { Container } from '../../../container/container';
import { ExpressModule } from '../../express.module';
import { ExpressServer } from '../../express-server';

describe('ExpressServer (listen)', () => {
  let server: ExpressServer;

  beforeEach(() => {
    const module = new ExpressModule();
    const providers = module.register()?.['providers'] ?? [];
    const container = new Container(providers);
    server = container.get<ExpressServer>(ExpressServer.name);
    server.initHttpServer({});
  });

  afterEach(async () => {
    await server.close();
  });

  it('should resolve with httpServer on success', () => {
    const response = server.listen(3000);
    expect(response).toEqual(server.getHttpServer());
  });
});
