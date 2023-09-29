import { declareTable } from './table';
import {
  boolean,
  number,
  string,
  enumerated,
  dateTime,
  InferFromFields,
} from './fields/declaration';

export { initDatabase } from './drivers';

export const Table = {
  make: declareTable,
  boolean,
  number,
  string,
  enumerated,
  dateTime,
};

export { InferFromFields };
