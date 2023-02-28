/**
 * Represents an abstract class `T`, if applied to a concrete class it would stop being
 * instantiable.
 */
export interface Abstract<T> extends Function {
  prototype: T;
}

/**
 * Represents an instantiable class `T` with constructor parameters.
 */
export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export interface Module {
  /**
   * Register any application configurations.
   */
  register(): any;
}

export interface Server {
  getInstance(): any;
  getHttpServer(): any;
  listen(port: number | string, callback?: () => void): any;
  listen(port: number | string, hostname: string, callback?: () => void): any;
  initHttpServer(options: any): void;
  close(): any;
  init?(): Promise<void>;
}
