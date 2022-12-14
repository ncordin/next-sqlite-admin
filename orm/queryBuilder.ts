import { AnyField, Fields } from './declaration';
import { encode, encodeName } from './formatters/encode';
import { ComparisonSymbol, Set, Where } from './types';

const OPERATORS: ComparisonSymbol[] = ['<', '<=', '>', '>=', '=', '!='];

export function makeWhere(name: string, fields: Fields, conditions: Where[]) {
  if (Object.keys(conditions).length === 0) {
    return '1 = 1';
  }

  return conditions
    .map(({ fieldName, comparison, value }) => {
      if (!OPERATORS.includes(comparison)) {
        throw new Error(`Invalid comparison operator ${comparison}`);
      }

      if (value === null) {
        // comparison = 'IS';
      }

      const escapedField = `${encodeName(name)}.${encodeName(fieldName)}`;
      const escapedValue = encode(value, fields[fieldName]);

      return `${escapedField} ${comparison} ${escapedValue}`;
    })
    .join(' AND ');
}

export function makeSet(name: string, fields: Fields, data: Set[]) {
  return data
    .map(({ fieldName, value }) => {
      const escaped = encode(value, fields[fieldName]);

      return `${encodeName(fieldName)} = ${escaped}`;
    })
    .join(', ');
}

function makeField(name: string, field: AnyField) {
  let sql = `"${name}" ${field.type}`;

  // TODO: AUTOINCREMENT (index)

  if (field.type === 'string' && field.maxLength) {
    sql = `${sql}(${field.maxLength})`;
  }

  if (field.primaryKey) {
    sql = `${sql} PRIMARY KEY`;
  }

  if (field.canBeNull === false) {
    sql = `${sql} NOT NULL`;
  }

  if (field.default !== null) {
    sql = `${sql} DEFAULT ${encode(field.default, field, false)}`;
  }

  return sql;
}

function makeFields(fields: Fields) {
  return Object.keys(fields)
    .map((name) => makeField(name, fields[name]))
    .join(', ');
}

export function makeCreateTable(name: string, fields: Fields) {
  return `CREATE TABLE \`${name}\` (${makeFields(fields)});`;
}
