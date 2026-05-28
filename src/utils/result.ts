export type Result<TSuccess, TError> =
  | { success: true; data: TSuccess }
  | { success: false; error: TError };

export const success = <TSuccess>(data: TSuccess): Result<TSuccess, never> => ({
  success: true,
  data,
});

export const error = <TError>(error: TError): Result<never, TError> => ({
  success: false,
  error,
});

export const bindResult = async <TSuccess, TError, U>(
  result: Result<TSuccess, TError>,
  fn: (data: TSuccess) => Result<U, TError> | Promise<Result<U, TError>>,
): Promise<Result<U, TError>> => {
  if (result.success) {
    // @ts-ignore - Promise.try introduced in JavaScript Baseline 2025, and may not be recognized by TypeScript yet
    return Promise.try(() => fn(result.data));
  } else {
    return result;
  }
};

export function pipeResult<A, B, TError>(
  fn1: (input: A) => Promise<Result<B, TError>>,
): (
  initialData: Promise<Result<A, TError>> | Result<A, TError>,
) => Promise<Result<B, TError>>;

export function pipeResult<A, B, C, TError>(
  fn1: (input: A) => Promise<Result<B, TError>>,
  fn2: (input: B) => Promise<Result<C, TError>>,
): (
  initialData: Promise<Result<A, TError>> | Result<A, TError>,
) => Promise<Result<C, TError>>;

export function pipeResult<A, B, C, D, TError>(
  fn1: (input: A) => Promise<Result<B, TError>>,
  fn2: (input: B) => Promise<Result<C, TError>>,
  fn3: (input: C) => Promise<Result<D, TError>>,
): (
  initialData: Promise<Result<A, TError>> | Result<A, TError>,
) => Promise<Result<D, TError>>;

export function pipeResult<A, B, C, D, E, TError>(
  fn1: (input: A) => Promise<Result<B, TError>>,
  fn2: (input: B) => Promise<Result<C, TError>>,
  fn3: (input: C) => Promise<Result<D, TError>>,
  fn4: (input: D) => Promise<Result<E, TError>>,
): (
  initialData: Promise<Result<A, TError>> | Result<A, TError>,
) => Promise<Result<E, TError>>;

export function pipeResult<A, B, C, D, E, F, TError>(
  fn1: (input: A) => Promise<Result<B, TError>>,
  fn2: (input: B) => Promise<Result<C, TError>>,
  fn3: (input: C) => Promise<Result<D, TError>>,
  fn4: (input: D) => Promise<Result<E, TError>>,
  fn5: (input: E) => Promise<Result<F, TError>>,
): (
  initialData: Promise<Result<A, TError>> | Result<A, TError>,
) => Promise<Result<F, TError>>;

export function pipeResult<A, B, C, D, E, F, G, TError>(
  fn1: (input: A) => Promise<Result<B, TError>>,
  fn2: (input: B) => Promise<Result<C, TError>>,
  fn3: (input: C) => Promise<Result<D, TError>>,
  fn4: (input: D) => Promise<Result<E, TError>>,
  fn5: (input: E) => Promise<Result<F, TError>>,
  fn6: (input: F) => Promise<Result<G, TError>>,
): (
  initialData: Promise<Result<A, TError>> | Result<A, TError>,
) => Promise<Result<G, TError>>;

export function pipeResult<A, B, C, D, E, F, G, H, TError>(
  fn1: (input: A) => Promise<Result<B, TError>>,
  fn2: (input: B) => Promise<Result<C, TError>>,
  fn3: (input: C) => Promise<Result<D, TError>>,
  fn4: (input: D) => Promise<Result<E, TError>>,
  fn5: (input: E) => Promise<Result<F, TError>>,
  fn6: (input: F) => Promise<Result<G, TError>>,
  fn7: (input: G) => Promise<Result<H, TError>>,
): (
  initialData: Promise<Result<A, TError>> | Result<A, TError>,
) => Promise<Result<H, TError>>;

export function pipeResult<A, B, C, D, E, F, G, H, I, TError>(
  fn1: (input: A) => Promise<Result<B, TError>>,
  fn2: (input: B) => Promise<Result<C, TError>>,
  fn3: (input: C) => Promise<Result<D, TError>>,
  fn4: (input: D) => Promise<Result<E, TError>>,
  fn5: (input: E) => Promise<Result<F, TError>>,
  fn6: (input: F) => Promise<Result<G, TError>>,
  fn7: (input: G) => Promise<Result<H, TError>>,
  fn8: (input: H) => Promise<Result<I, TError>>,
): (
  initialData: Promise<Result<A, TError>> | Result<A, TError>,
) => Promise<Result<I, TError>>;

export function pipeResult<A, B, C, D, E, F, G, H, I, J, TError>(
  fn1: (input: A) => Promise<Result<B, TError>>,
  fn2: (input: B) => Promise<Result<C, TError>>,
  fn3: (input: C) => Promise<Result<D, TError>>,
  fn4: (input: D) => Promise<Result<E, TError>>,
  fn5: (input: E) => Promise<Result<F, TError>>,
  fn6: (input: F) => Promise<Result<G, TError>>,
  fn7: (input: G) => Promise<Result<H, TError>>,
  fn8: (input: H) => Promise<Result<I, TError>>,
  fn9: (input: I) => Promise<Result<J, TError>>,
): (
  initialData: Promise<Result<A, TError>> | Result<A, TError>,
) => Promise<Result<J, TError>>;

export function pipeResult<A, B, C, D, E, F, G, H, I, J, K, TError>(
  fn1: (input: A) => Promise<Result<B, TError>>,
  fn2: (input: B) => Promise<Result<C, TError>>,
  fn3: (input: C) => Promise<Result<D, TError>>,
  fn4: (input: D) => Promise<Result<E, TError>>,
  fn5: (input: E) => Promise<Result<F, TError>>,
  fn6: (input: F) => Promise<Result<G, TError>>,
  fn7: (input: G) => Promise<Result<H, TError>>,
  fn8: (input: H) => Promise<Result<I, TError>>,
  fn9: (input: I) => Promise<Result<J, TError>>,
  fn10: (input: J) => Promise<Result<K, TError>>,
): (
  initialData: Promise<Result<A, TError>> | Result<A, TError>,
) => Promise<Result<K, TError>>;

export function pipeResult<TError>(
  ...fns: Array<(data: any) => Promise<Result<any, TError>>>
) {
  return async (initialData: any): Promise<Result<any, TError>> => {
    return fns.reduce(async (acc, fn) => {
      const result = await acc;
      return bindResult(result, fn);
    }, Promise.resolve(initialData));
  };
}

export function match<TSuccess, TError>(
  result: Result<TSuccess, TError>,
  onSuccess: (data: TSuccess) => void,
  onError: (error: TError) => void,
) {
  if (result.success) {
    void onSuccess(result.data);
  } else {
    void onError(result.error);
  }
}

export function mapResult<TSuccess, TError, U>(
  result: Result<TSuccess, TError>,
  fn: (data: TSuccess) => U,
): Result<U, TError> {
  if (result.success) {
    return success(fn(result.data));
  } else {
    return result;
  }
}

export function pureResult<TSuccess, TError>(
  data: TSuccess,
): Result<TSuccess, TError> {
  return success(data);
}
