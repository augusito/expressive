import { globSync } from 'glob';
import { join } from 'path';
import { ConfigAggregator, mergeConfig } from '../lib/common/config-aggregator';
import { dynamicRequire } from '../lib/common/dynamic-require';
import { AppModule } from '../lib/core/app.module';
import { ExpressModule } from '../lib/express/express.module';
import { HelloModule } from './hello/hello.module';

const aggregator = new ConfigAggregator([
  AppModule,
  ExpressModule,
  HelloModule,
  () => {
    let config = {};
    // Load configuration from config path
    const paths = globSync(
      join(__dirname, '..', 'config/{{,*.}global,{,*.}local}.+(j|t)s'),
    );
    // Require each file in the config dir
    paths.forEach((file: any) => {
      config = mergeConfig(config, dynamicRequire(file));
    });
    // return an object containing of configurations
    return config;
  },
]);
const config = aggregator.getMergedConfig();

export { config };
