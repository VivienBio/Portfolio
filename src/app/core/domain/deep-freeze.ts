type ImmutableValue = null | undefined | string | number | boolean | bigint | symbol | object;

export function deepFreeze<T extends ImmutableValue>(value: T): Readonly<T> {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  Object.freeze(value);
  for (const property of Reflect.ownKeys(value)) {
    const nestedValue = Reflect.get(value, property) as ImmutableValue;
    deepFreeze(nestedValue);
  }

  return value;
}
