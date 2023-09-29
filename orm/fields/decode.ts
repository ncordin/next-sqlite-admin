import { RawRow } from '../types';
import { AnyField, Fields } from './declaration';

function decode(value: unknown, field: AnyField) {
  if (value === null) {
    return null;
  }

  if (value === undefined) {
    return undefined;
  }

  switch (field.type) {
    case 'boolean':
      return !!value;

    case 'integer':
      return parseInt(value as string, 10);

    case 'string':
      return `${value}`;

    case 'enumerated':
      return `${value}`;

    case 'datetime':
      return new Date(Date.parse(value as string));

    default:
      throw new Error('This can not happen.');
  }
}

function decodeRaw<TableType>(raw: RawRow, fields: Fields) {
  return Object.keys(fields).reduce((previous, key) => {
    return { ...previous, [key]: decode(raw[key], fields[key]) };
  }, {}) as TableType;
}

export function decodeRaws<TableType>(rows: RawRow[], fields: Fields) {
  return rows.map((row) => decodeRaw<TableType>(row, fields));
}
