import { Fields } from './declaration';
import { encode, encodeName } from './formatters/encode';
import { SetOfComparisonValues, SetOfValues } from './types';

export function makeWhere(
  name: string,
  fields: Fields,
  conditions: SetOfComparisonValues = {}
) {
  if (Object.keys(conditions).length === 0) {
    return '1 = 1';
  }

  return Object.entries(conditions)
    .map(([field, value]) => {
      let comparison = '=';
      let rawValue = null;

      if (typeof value === 'object' && value) {
        const [action, content] = Object.entries(value)[0];
        const definedContent = content === undefined ? null : content;

        if (['<', '<=', '>', '>=', '='].includes(action)) {
          comparison = action;
          rawValue = definedContent;
        }
      } else {
        rawValue = value;
      }

      const escaped = encode(rawValue, fields[field]);
      const escapedField = `${encodeName(name)}.${encodeName(field)}`;

      return `${escapedField} ${comparison} ${escaped}`;
    })
    .join(' AND ');
}

export function makeSet(name: string, fields: Fields, data: SetOfValues) {
  return Object.entries(data)
    .map(([field, value]) => {
      const escaped = encode(value, fields[field]);

      return `${encodeName(field)} = ${escaped}`;
    })
    .join(', ');
}
