import { CallableMiddlewareDecorator } from '../../../middleware/callable-middleware-decorator';

describe('callableMiddlewareDecorator', () => {
  it('should produce response when process call', () => {
    const middleware = (req: any, res: any): string => 'foo';
    const decorator = new CallableMiddlewareDecorator(middleware);
    expect(decorator.process(jest.fn(), jest.fn(), jest.fn())).toEqual('foo');
  });
});
