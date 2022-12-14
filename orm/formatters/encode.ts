import { AnyField } from '../declaration';
import { Value } from '../types';

const quotify = (string: string, quote: string) => {
  return `${quote}${string}${quote}`; // Backslash should be done here.
};

const convertToUTCSqlDate = (date: Date) => {
  const parts = [
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  ].map((value) => String(value).padStart(2, '0'));

  return `${parts[0]}-${parts[1]}-${parts[2]} ${parts[3]}:${parts[4]}:${parts[5]}`;
};

let currentParameters: string[] = [];

export const addParameters = (value: string) => {
  currentParameters.push(value);
};

export const getAndFlushParameters = () => {
  const parameters = currentParameters;

  currentParameters = [];

  return parameters;
};

export const encode = (
  value: Value,
  field: AnyField,
  useEscaper = true
): string => {
  if (value === null) {
    if (field.canBeNull) {
      return 'null';
    } else {
      throw new Error(`Encode failed, null is not allowed.`);
    }
  }

  if (typeof value === 'object' && '_SQL' in value) {
    return value._SQL;
  }

  switch (field.type) {
    case 'datetime':
      return quotify(convertToUTCSqlDate(value as unknown as Date), `'`);

    case 'number':
      return `${parseInt(value as string, 10)}`;

    case 'boolean':
      return value ? '1' : '0';

    case 'string':
      if (useEscaper) {
        addParameters((value as string).slice(0, field.maxLength));
        return '?';
      } else {
        return quotify(`${value}`, '"');
      }

    case 'enumerated':
      if (field.values.includes(value as string)) {
        return `'${value}'`;
      } else {
        throw new Error(
          `Encode enumerated failed, ${value} not in ${field.values.join(':')}.`
        );
      }
  }

  console.error(`Can't encode ${value}`);
  return '!!!';
};

export const encodeName = (string: string) => {
  return quotify(string, '`');
};
