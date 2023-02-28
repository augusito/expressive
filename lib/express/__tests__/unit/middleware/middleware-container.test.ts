import { HttpHandlerMiddleware } from '../../../middleware/hem-handler-middleware';
import { MiddlewareContainer } from '../../../middleware/middleware-container';
import { InMemoryContainer } from '../in-memory-container';
import { NormalHandler } from '../../fixtures/normal-handler';
import { NormalMiddleware } from '../../fixtures/normal-middleware';

describe('MiddlewareContainer', () => {
  let container: MiddlewareContainer;
  let originContainer: InMemoryContainer;

  beforeEach(async () => {
    originContainer = new InMemoryContainer();
    container = new MiddlewareContainer(originContainer);
  });

  afterEach(async () => {
    originContainer.reset();
  });

  it('should return true when original container has service', async () => {
    originContainer.set('service', new Date());
    expect(container.has('service')).toBeTruthy();
  });

  it('should return true when callable', async () => {
    expect(container.has(jest.fn())).toBeTruthy();
  });

  it('should return false when original container has no service', async () => {
    expect(container.has('not-a-callable')).toBeFalsy();
  });

  it('should throw when service unknown', async () => {
    expect(() => container.get('not-a-service')).toThrow();
  });

  it('should throw when service does not define `process` method', async () => {
    originContainer.set('middleware', new Date());
    expect(() => container.get('middleware')).toThrow();
  });

  it('should throw when callable does not define `process` method', async () => {
    expect(() => container.get(jest.fn())).toThrow();
  });

  it('should return service from original container', async () => {
    originContainer.set('middleware-service', new NormalMiddleware());
    expect(container.get('middleware-service')).toBeInstanceOf(
      NormalMiddleware,
    );
  });

  it('should decorate hem handler as middleware', async () => {
    originContainer.set('handler-service', new NormalHandler());
    expect(container.get('handler-service')).toEqual(
      new HttpHandlerMiddleware(new NormalHandler()),
    );
  });
});
