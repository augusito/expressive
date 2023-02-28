import { ConfigAggregator } from '../lib/common/config-aggregator';
import { AppModule } from '../lib/core/app.module';
import { ExpressModule } from '../lib/express/express.module';

const aggregator = new ConfigAggregator([AppModule, ExpressModule]);
const config = aggregator.getMergedConfig();

export { config };
