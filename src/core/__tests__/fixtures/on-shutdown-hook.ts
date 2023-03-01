import type { ShutdownHook } from '../../../../src/common/types';

export class OnShutdownHook implements Omit<ShutdownHook, 'beforeShutdown'> {
  onShutdown(signal?: string | undefined) {}
}
