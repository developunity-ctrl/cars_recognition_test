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

export const bind = async <TSuccess, TError, U>(
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

export function pipe<A, B, TError>(
  result: Promise<Result<A, TError>>,
  fn1: (input: A) => Promise<Result<B, TError>>,
): Promise<Result<B, TError>>;

export function pipe<A, B, C, TError>(
  result: Promise<Result<A, TError>>,
  fn1: (input: A) => Promise<Result<B, TError>>,
  fn2: (input: B) => Promise<Result<C, TError>>,
): Promise<Result<C, TError>>;

export function pipe<A, B, C, D, TError>(
  result: Promise<Result<A, TError>>,
  fn1: (input: A) => Promise<Result<B, TError>>,
  fn2: (input: B) => Promise<Result<C, TError>>,
  fn3: (input: C) => Promise<Result<D, TError>>,
): Promise<Result<D, TError>>;

export function pipe<A, B, C, D, E, TError>(
  result: Promise<Result<A, TError>>,
  fn1: (input: A) => Promise<Result<B, TError>>,
  fn2: (input: B) => Promise<Result<C, TError>>,
  fn3: (input: C) => Promise<Result<D, TError>>,
  fn4: (input: D) => Promise<Result<E, TError>>,
): Promise<Result<E, TError>>;

export function pipe<A, B, C, D, E, F, TError>(
  result: Promise<Result<A, TError>>,
  fn1: (input: A) => Promise<Result<B, TError>>,
  fn2: (input: B) => Promise<Result<C, TError>>,
  fn3: (input: C) => Promise<Result<D, TError>>,
  fn4: (input: D) => Promise<Result<E, TError>>,
  fn5: (input: E) => Promise<Result<F, TError>>,
): Promise<Result<F, TError>>;

export function pipe<A, B, C, D, E, F, G, TError>(
  result: Promise<Result<A, TError>>,
  fn1: (input: A) => Promise<Result<B, TError>>,
  fn2: (input: B) => Promise<Result<C, TError>>,
  fn3: (input: C) => Promise<Result<D, TError>>,
  fn4: (input: D) => Promise<Result<E, TError>>,
  fn5: (input: E) => Promise<Result<F, TError>>,
  fn6: (input: F) => Promise<Result<G, TError>>,
): Promise<Result<G, TError>>;

export function pipe<A, B, C, D, E, F, G, H, TError>(
  result: Promise<Result<A, TError>>,
  fn1: (input: A) => Promise<Result<B, TError>>,
  fn2: (input: B) => Promise<Result<C, TError>>,
  fn3: (input: C) => Promise<Result<D, TError>>,
  fn4: (input: D) => Promise<Result<E, TError>>,
  fn5: (input: E) => Promise<Result<F, TError>>,
  fn6: (input: F) => Promise<Result<G, TError>>,
  fn7: (input: G) => Promise<Result<H, TError>>,
): Promise<Result<H, TError>>;

export function pipe<A, B, C, D, E, F, G, H, I, TError>(
  result: Promise<Result<A, TError>>,
  fn1: (input: A) => Promise<Result<B, TError>>,
  fn2: (input: B) => Promise<Result<C, TError>>,
  fn3: (input: C) => Promise<Result<D, TError>>,
  fn4: (input: D) => Promise<Result<E, TError>>,
  fn5: (input: E) => Promise<Result<F, TError>>,
  fn6: (input: F) => Promise<Result<G, TError>>,
  fn7: (input: G) => Promise<Result<H, TError>>,
  fn8: (input: H) => Promise<Result<I, TError>>,
): Promise<Result<I, TError>>;

export function pipe<A, B, C, D, E, F, G, H, I, J, TError>(
  result: Promise<Result<A, TError>>,
  fn1: (input: A) => Promise<Result<B, TError>>,
  fn2: (input: B) => Promise<Result<C, TError>>,
  fn3: (input: C) => Promise<Result<D, TError>>,
  fn4: (input: D) => Promise<Result<E, TError>>,
  fn5: (input: E) => Promise<Result<F, TError>>,
  fn6: (input: F) => Promise<Result<G, TError>>,
  fn7: (input: G) => Promise<Result<H, TError>>,
  fn8: (input: H) => Promise<Result<I, TError>>,
  fn9: (input: I) => Promise<Result<J, TError>>,
): Promise<Result<J, TError>>;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, TError>(
  result: Promise<Result<A, TError>>,
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
): Promise<Result<K, TError>>;

export async function pipe<TError>(
  result: Promise<Result<any, TError>>,
  ...fns: Array<(data: any) => Promise<Result<any, TError>>>
): Promise<Result<any, TError>> {
  let current = await result;

  for (const fn of fns) {
    current = await bind(current, fn);
  }

  return current;
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
