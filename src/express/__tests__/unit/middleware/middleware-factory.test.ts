import { NormalHandler } from '../../fixtures/normal-handler';
import { NormalMiddleware } from '../../fixtures/normal-middleware';
import { NoopMiddleware } from '../../fixtures/noop-middleware';
import { MiddlewareContainer } from '../../../middleware/middleware-container';
import { InMemoryContainer } from '../in-memory-container';
import { MiddlewareFactory } from '../../../middleware/middleware-factory';
import { HttpHandlerMiddleware } from '../../../middleware/hem-handler-middleware';
import { CallableMiddlewareDecorator } from '../../../middleware/callable-middleware-decorator';

describe('MiddlewareFactory', () => {
  let container: MiddlewareContainer;
  let originContainer: InMemoryContainer;
  let factory: MiddlewareFactory;

  beforeEach(async () => {
    originContainer = new InMemoryContainer();
    container = new MiddlewareContainer(originContainer);
    factory = new MiddlewareFactory(container);
  });

  afterEach(async () => {
    originContainer.reset();
  });

  it('should prepare middleware implementation verbatim', () => {
    const middleware = new NormalMiddleware();
    expect(factory.prepare(middleware)).toEqual(middleware);
  });

  it('should prepare hem handler as middleware', () => {
    const handler = new NormalHandler();
    const middleware = factory.prepare(handler);
    expect(middleware).toEqual(new HttpHandlerMiddleware(handler));
  });

  it('should decorate hem handler as middleware', () => {
    const handler = new NormalHandler();
    const middleware = factory.handler(handler);
    expect(middleware).toEqual(new HttpHandlerMiddleware(handler));
  });

  it('should prepare callable as middleware', () => {
    const callable = (req: any, res: any): void => {};
    const middleware = factory.prepare(callable);
    expect(middleware).toEqual(new CallableMiddlewareDecorator(callable));
  });

  it('should decorate callable as middleware', () => {
    const callable = (req: any, res: any): void => {};
    const middleware = factory.callable(callable);
    expect(middleware).toEqual(new CallableMiddlewareDecorator(callable));
  });

  it('should prepare middleware class as middleware', () => {
    const middleware = factory.prepare(NormalMiddleware);
    expect(middleware).toBeInstanceOf(NormalMiddleware);
  });

  it('should prepare hem handler class as middleware', () => {
    const middleware = factory.prepare(NormalHandler);
    expect(middleware).toEqual(factory.handler(new NormalHandler()));
  });

  it('should prepare array middleware as middleware array', () => {
    const middleware1 = new NormalMiddleware();
    const middleware2 = new NormalMiddleware();
    const middleware = factory.prepare([middleware1, middleware2]);
    expect(middleware).toEqual([middleware1, middleware2]);
  });

  it('should lazy prepare middleware when string', () => {
    const token = 'middleware-service';
    const middleware = new NormalMiddleware();
    originContainer.set(token, middleware);
    expect(factory.prepare(token)).toEqual(
      container.get<NormalMiddleware>(token),
    );
  });

  it('should lazy prepare middleware when symbol', () => {
    const token = Symbol('middleware-service');
    const middleware = new NormalMiddleware();
    originContainer.set(token, middleware);
    expect(factory.prepare(token)).toEqual(
      container.get<NormalMiddleware>(token),
    );
  });

  it('should lazy prepare middleware when string array', () => {
    const token1 = 'middleware-service1';
    const middleware1 = new NormalMiddleware();
    const token2 = 'middleware-service2';
    const middleware2 = new NormalMiddleware();
    originContainer.set(token1, middleware1);
    originContainer.set(token2, middleware2);
    expect(factory.prepare([token1, token2])).toEqual([
      container.get<NormalMiddleware>(token1),
      container.get<NormalMiddleware>(token2),
    ]);
  });

  it('should throw when invalid type as middleware', async () => {
    expect(() => factory.prepare(null)).toThrow();
    expect(() => factory.prepare(false)).toThrow();
    expect(() => factory.prepare(123)).toThrow();
    expect(() => factory.prepare(NoopMiddleware)).toThrow();
  });
});
