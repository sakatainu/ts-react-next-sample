export type Inspect<T> = (value: unknown) => T;

export const inspectString: Inspect<string> = (value) => {
  if (typeof value !== 'string')
    throw new Error(`value is not string. ${typeof value} ${String(value)}`);
  return value;
};
