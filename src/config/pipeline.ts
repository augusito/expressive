import {
  json as bodyParserJson,
  OptionsJson,
  OptionsUrlencoded,
  urlencoded as bodyParserUrlencoded,
} from 'body-parser';
import { getBodyParserOptions } from '../common/get-body-parser-options';
import type { IContainer } from '../container/types';
import type { ExpressServer } from '../express/express-server';

export function definePipeline(app: ExpressServer, container: IContainer) {
  const config: any = container.has('config') ? container.get('config') : {};
  const bodyParserOptions = config.bodyParser?.options ?? {};
  const rawBody = !!bodyParserOptions.rawBody;

  const bodyParserUrlencodedOptions = getBodyParserOptions<OptionsUrlencoded>(
    rawBody,
    { extended: true },
  );
  app.pipe(bodyParserUrlencoded(bodyParserUrlencodedOptions));
  const bodyParserJsonOptions = getBodyParserOptions<OptionsJson>(rawBody);
  app.pipe(bodyParserJson(bodyParserJsonOptions));
}
