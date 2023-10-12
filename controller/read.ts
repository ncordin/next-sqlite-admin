export function read<T>(
  data: unknown,
  type: 'string',
  defaultValue: T
): string | T;
export function read<T>(
  data: unknown,
  type: 'number',
  defaultValue: T
): number | T;
export function read<T>(
  data: unknown,
  type: 'boolean',
  defaultValue: T
): boolean | T;

export function read<T>(
  data: unknown,
  type: 'string' | 'number' | 'boolean',
  defaultValue: T
) {
  const typeOfData = typeof data;

  if (type === 'string') {
    switch (typeOfData) {
      case 'string':
        return data;

      case 'number':
      case 'bigint':
        return String(data);

      case 'boolean':
      case 'function':
      case 'object':
      case 'symbol':
      case 'undefined':
        return defaultValue;
    }
  }

  if (type === 'number') {
    switch (typeOfData) {
      case 'number':
      case 'bigint':
        return data;

      case 'string':
        const parsed = parseFloat(data as string);
        return String(parsed) === data ? parsed : defaultValue;

      case 'boolean':
      case 'function':
      case 'object':
      case 'symbol':
      case 'undefined':
        return defaultValue;
    }
  }

  if (type === 'boolean') {
    switch (typeOfData) {
      case 'boolean':
        return data;

      case 'number':
      case 'bigint':
        return data === 0 ? false : data === 1 ? true : defaultValue;

      case 'string':
        return data === '0' || data === 'false'
          ? false
          : data === '1' || data === 'true'
          ? true
          : defaultValue;

      case 'function':
      case 'object':
      case 'symbol':
      case 'undefined':
        return defaultValue;
    }
  }
}
