/**
 * Token that can be used to retrieve an instance from a container.
 */
export type ProviderToken = string | symbol;

/**
 * Represents type for a factory. A factory is a function that is able to create an object.
 * It is provided with an instance of the container in order to access required dependencies.
 */
export type Factory<T = any> = (container: IContainer) => T;

/**
 * Represents an instantiable class `T` that doesn't require arguments to the constructor.
 */
export interface NoArgument<T = any> extends Function {
  new (): T;
}

/**
 * Describes the interface of a container that exposes methods to read its entries.
 */
export interface IContainer {
  /**
   * Find an entry of the container based on the provided token.
   * @param token the provider token of the entry to look for
   * @returns an entry from the container if defined
   * @throws Error if no entry was found for the token
   * @throws Error if error while retrieving the entry
   */
  get<T>(token: ProviderToken): T;

  /**
   * Check if an entry for the given provider token exists.
   * @param token the provider token of the entry to look for
   * @returns whether an entry for the given provider exists
   */
  has(token: ProviderToken): boolean;
}

/**
 * Configures the `Container` to return a value for a token.
 */
export interface ValueProvider<T = any> {
  /**
   * Provider token.
   */
  provide: ProviderToken;

  /**
   * The value to inject.
   */
  useValue: T;
}

/**
 * Configures the `Container` to return an instance of `useClass` for a token.
 */
export interface ClassProvider<T = any> {
  /**
   * Provider token.
   */
  provide: ProviderToken;

  /**
   * Class to instantiate for the `token`.
   */
  useClass: NoArgument<T>;
}

/**
 * Configures the `Container` to return a value by invoking a `useFactory` function.
 */
export interface FactoryProvider<T = any> {
  /**
   * Provider token.
   */
  provide: ProviderToken;

  /**
   * A function to invoke to create an instance for this `token`. The function is
   * invoked with resolved values of token`s from an instance of the container.
   */
  useFactory: Factory<T>;
}

/**
 * Configures the `Container` to return a value of another `useExisting` token.
 */
export interface ExistingProvider<T = any> {
  /**
   * Provider token.
   */
  provide: ProviderToken;

  /**
   * Existing `token` to return.
   */
  useExisting: T;
}

export type Provider<T = any> =
  | ValueProvider<T>
  | ClassProvider<T>
  | FactoryProvider<T>
  | ExistingProvider<T>;
