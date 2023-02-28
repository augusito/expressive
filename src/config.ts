import { ConfigAggregator } from '../lib/common/config-aggregator';
import { AppModule } from '../lib/core/app.module';
import { ExpressModule } from '../lib/express/express.module';
import { HelloModule } from './hello/hello.module';

const aggregator = new ConfigAggregator([
  AppModule,
  ExpressModule,
  HelloModule,
]);
const config = aggregator.getMergedConfig();

export { config };
