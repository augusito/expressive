import { HookCollector } from '../../../hooks/hook-collector';
import { HookContainer } from '../../../hooks/hook-container';
import { HookFactory } from '../../../hooks/hook-factory';
import { InMemoryContainer } from '../in-memory-container';
import { BeforeShutdownHook } from '../../fixtures/before-shutdown-hook';
import { NoopHook } from '../../fixtures/noop-hook';
import { OnStartupHook } from '../../fixtures/on-startup-hook';
import { OnShutdownHook } from '../../fixtures/on-shutdown-hook';

describe('HookCollector', () => {
  let originContainer: InMemoryContainer;
  let factory: HookFactory;
  let noopHook: NoopHook;

  beforeEach(() => {
    originContainer = new InMemoryContainer();
    const container = new HookContainer(originContainer);
    factory = new HookFactory(container);
    noopHook = new NoopHook();
  });

  afterEach(() => {
    originContainer.reset();
  });

  it('should return instance of HookCollector', () => {
    const hookCollector = new HookCollector(factory);
    expect(hookCollector).toBeInstanceOf(HookCollector);
  });

  it('should call "startup" hook', async () => {
    const hook = new OnStartupHook();
    const hookSpy = jest.spyOn(hook, 'onStartup');
    const hookCollector = new HookCollector(factory, [hook, noopHook]);
    hookCollector.addStartupHook();
    expect(hookSpy).toHaveBeenCalled();
  });

  it('should call "beforeShutdown" hook', async () => {
    const signal = 'SIGTERM';
    const hook = new BeforeShutdownHook();
    const hookSpy = jest.spyOn(hook, 'beforeShutdown');
    const hookCollector = new HookCollector(factory, [hook, noopHook]);
    await hookCollector.addBeforeShutdownHook(signal);
    expect(hookSpy).toHaveBeenCalledWith(signal);
  });

  it('should call "onShutdown" hook', async () => {
    const signal = 'SIGTERM';
    const hook = new OnShutdownHook();
    const hookSpy = jest.spyOn(hook, 'onShutdown');
    const hookCollector = new HookCollector(factory, [hook, noopHook]);
    await hookCollector.addShutdownHook(signal);
    expect(hookSpy).toHaveBeenCalledWith(signal);
  });
});
