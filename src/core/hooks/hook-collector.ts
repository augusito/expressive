import { iterate } from 'iterare';
import type { ShutdownHook, StartupHook } from '../../../src/common/types';
import { isFunction, isNil } from '../../../src/common/utils/lang.util';
import type { HookFactory } from './hook-factory';

export class HookCollector {
  private instances: any[] = [];

  constructor(
    private readonly factory: HookFactory,
    private readonly hooks: any[] = [],
  ) {
    this.initialize();
  }

  public async addStartupHook(): Promise<void> {
    await Promise.all(this.runStartupHook(this.instances));
  }

  public async addBeforeShutdownHook(signal?: string): Promise<void> {
    await Promise.all(this.runBeforeShutdownHook(this.instances, signal));
  }

  public async addShutdownHook(signal?: string): Promise<void> {
    await Promise.all(this.runShutdownHook(this.instances, signal));
  }

  private initialize(): void {
    this.instances = this.factory.prepare(this.hooks);
  }

  private runStartupHook(instances: any[]): Promise<void>[] {
    return iterate(instances)
      .filter((instance: any) => !isNil(instance))
      .filter(this.isStartupHook)
      .map(async (instance: any) => {
        (instance as StartupHook).onStartup();
      })
      .toArray();
  }

  private runBeforeShutdownHook(
    instances: any[],
    signal?: string,
  ): Promise<any>[] {
    return iterate(instances)
      .filter((instance: any) => !isNil(instance))
      .filter(this.isBeforeShutdownHook)
      .map(async (instance: any) =>
        (instance as ShutdownHook).beforeShutdown(signal),
      )
      .toArray();
  }

  private runShutdownHook(instances: any[], signal?: string): Promise<void>[] {
    return iterate(instances)
      .filter((instance: any) => !isNil(instance))
      .filter(this.isShutdownHook)
      .map(async (insatnce: any) => {
        (insatnce as ShutdownHook).onShutdown(signal);
      })
      .toArray();
  }

  private isStartupHook(instance: unknown): instance is StartupHook {
    return isFunction((instance as StartupHook).onStartup);
  }

  private isBeforeShutdownHook(instance: unknown): instance is ShutdownHook {
    return isFunction((instance as ShutdownHook).beforeShutdown);
  }

  private isShutdownHook(instance: unknown): instance is ShutdownHook {
    return isFunction((instance as ShutdownHook).onShutdown);
  }
}
