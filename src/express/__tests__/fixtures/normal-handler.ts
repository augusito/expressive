import type { HttpHandler } from '../../types';

export class NormalHandler implements HttpHandler {
  handle(req: any, res: any) {
    return 'foo';
  }
}
