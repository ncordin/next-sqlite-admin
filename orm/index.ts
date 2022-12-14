import { declareTable } from './table';
import { boolean, number, string, enumerated, dateTime } from './declaration';

export { Insertable } from './types';

export { initDatabase, queryRun, queryGet } from './connection';

// Weird error
export const Table = {
  make: declareTable,
  boolean,
  number,
  string,
  enumerated,
  dateTime,
};
