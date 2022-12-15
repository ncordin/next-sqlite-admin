import { AnyField, Fields } from '../fields/declaration';
import { encode, encodeName } from '../fields/encode';
import { ComparisonSymbol, Set, Value, Where } from '../types';

const OPERATORS: ComparisonSymbol[] = ['<', '<=', '>', '>=', '=', '!='];

const escapeOperator = (operator: ComparisonSymbol, value: Value) => {
  if (OPERATORS.includes(operator) === false) {
    throw new Error(`Invalid comparison operator ${operator}`);
  }

  if (value === null) {
    return operator === '=' ? 'IS' : 'IS NOT';
  }

  return operator;
};

export function makeWhere(name: string, fields: Fields, conditions: Where[]) {
  if (Object.keys(conditions).length === 0) {
    return '1 = 1';
  }

  return conditions
    .map(({ fieldName, comparison, value }) => {
      const escapedField = `${encodeName(name)}.${encodeName(fieldName)}`;
      const escapedOperator = escapeOperator(comparison, value);
      const escapedValue = encode(value, fields[fieldName]);

      return `${escapedField} ${escapedOperator} ${escapedValue}`;
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
