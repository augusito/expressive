import { omit } from '../common/utils/object.util';
import { Container } from '../container/container';
import { config } from './config';

const container = new Container(config.providers);
container.addProvider({
  provide: 'config',
  useValue: omit(config, ['providers']),
});

export { container };
