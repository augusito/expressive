import type { HttpMiddleware } from '../../types';

export class NormalMiddleware implements HttpMiddleware {
  process(req: any, res: any, next: (error?: any) => void) {
    return 'foo';
  }
}
