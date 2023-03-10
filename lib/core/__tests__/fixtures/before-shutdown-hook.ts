import type { ShutdownHook } from '../../../common/types';

export class BeforeShutdownHook implements Omit<ShutdownHook, 'onShutdown'> {
  beforeShutdown(signal?: string | undefined) {}
}
