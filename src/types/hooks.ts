export type AsyncHookResult<T> = {
  fetching: boolean;
  error?: Error;
  result?: T;
};

export type DispatcherResult<T> = Promise<{
  error?: Error;
  data?: T;
}>;
