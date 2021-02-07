import { declareTable } from './table';
import {
  boolean,
  number,
  bigInt,
  string,
  enumerated,
  dateTime,
} from './declaration';

export { initDatabase, queryRun, queryGet } from './connection';
export { Insertable } from './table';

export const Table = {
  make: declareTable,
  boolean,
  number,
  bigInt,
  string,
  enumerated,
  dateTime,
};
