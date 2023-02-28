import {
  json as bodyParserJson,
  OptionsJson,
  OptionsUrlencoded,
  urlencoded as bodyParserUrlencoded,
} from 'body-parser';
import { getBodyParserOptions } from '../lib/common/get-body-parser-options';
import { IContainer } from '../lib/container/types';
import { ExpressServer } from '../lib/express/express-server';

export function definePepiline(server: ExpressServer, container: IContainer) {
  const config: any = container.has('config') ? container.get('config') : {};
  const bodyParserOptions = config.bodyParser?.options ?? {};
  const rawBody = !!bodyParserOptions.rawBody;

  const bodyParserUrlencodedOptions = getBodyParserOptions<OptionsUrlencoded>(
    rawBody,
    { extended: true },
  );
  server.pipe(bodyParserUrlencoded(bodyParserUrlencodedOptions));
  const bodyParserJsonOptions = getBodyParserOptions<OptionsJson>(rawBody);
  server.pipe(bodyParserJson(bodyParserJsonOptions));
}
