import { HttpHandlerMiddleware } from '../../../middleware/hem-handler-middleware';
import { NormalHandler } from '../../fixtures/normal-handler';

describe('HttpHandlerMiddleware', () => {
  it('should produce response when process call', () => {
    const middleware = new HttpHandlerMiddleware(new NormalHandler());
    expect(middleware.process(jest.fn(), jest.fn(), jest.fn())).toEqual('foo');
  });
});
