import { declareTable } from './table';
import {
  boolean,
  number,
  string,
  enumerated,
  dateTime,
} from './fields/declaration';

export { Insertable } from './types';

export { initDatabase } from './drivers';

export const Table = {
  make: declareTable,
  boolean,
  number,
  string,
  enumerated,
  dateTime,
};
