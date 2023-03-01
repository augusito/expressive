import type { ShutdownHook } from '../../../../src/common/types';

export class BeforeShutdownHook implements Omit<ShutdownHook, 'onShutdown'> {
  beforeShutdown(signal?: string | undefined) {}
}
