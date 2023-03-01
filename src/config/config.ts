import { globSync } from 'glob';
import { join } from 'path';
import { ConfigAggregator, mergeConfig } from '../common/config-aggregator';
import { dynamicRequire } from '../common/dynamic-require';
import { AppModule } from '../core/app.module';
import { ExpressModule } from '../express/express.module';
import { HelloModule } from '../hello/hello.module';

const aggregator = new ConfigAggregator([
  AppModule,
  ExpressModule,
  HelloModule,
  () => {
    let config = {};
    // Load configuration from autoload path
    const paths = globSync(
      join(__dirname, 'autoload/{{,*.}global,{,*.}local}.+(j|t)s'),
    );
    // Require each file in the autoload dir
    paths.forEach((file: any) => {
      config = mergeConfig(config, dynamicRequire(file));
    });
    // return an object containing of configurations
    return config;
  },
]);

const config = aggregator.getMergedConfig();

export { config };
