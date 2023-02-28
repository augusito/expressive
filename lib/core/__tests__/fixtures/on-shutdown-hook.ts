import type { ShutdownHook } from '../../../common/types';

export class OnShutdownHook implements Omit<ShutdownHook, 'beforeShutdown'> {
  onShutdown(signal?: string | undefined) {}
}
