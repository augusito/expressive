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
