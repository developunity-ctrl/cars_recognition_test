export {};

declare global {
  interface PromiseConstructor {
    /**
     * The `Promise.try` method executes the provided function and returns a Promise that is resolved with the function's return value or rejected with any error thrown by the function.
     * @param fn A function that returns a value or throws an error.
     * @returns A Promise that is resolved with the return value of the function or rejected with any error thrown by the function.
     */
    try<T>(fn: () => T | PromiseLike<T>): Promise<T>;
  }
}
