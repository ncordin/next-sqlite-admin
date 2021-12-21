import sqlite, { Database } from 'better-sqlite3';
import { DatabaseConfiguration, RawRow } from '../types';
import { logQuery } from '../utils/logger';
import { Fields } from './declaration';
import { makeCreateTable } from './queryBuilder';

let database: Database | null = null;

const NO_SUCH_TABLE = 'no such table: ';

type QueryOptions = {
  sql: string;
  parameters: string[];
  name: string;
  fields: Fields;
};

export const initDatabase = function (config: DatabaseConfiguration) {
  database = sqlite(config.file);
  database.defaultSafeIntegers(true);
};

export const queryGet = ({ sql, parameters, name, fields }: QueryOptions) => {
  logQuery(sql, parameters);

  return new Promise<RawRow[]>((resolve, reject) => {
    if (!database) {
      reject('Query failed, connection is not ready. ' + sql);
      return;
    }

    try {
      const results = database.prepare(sql).all(parameters);
      resolve(results as RawRow[]);
    } catch (error) {
      if (error.message.startsWith(NO_SUCH_TABLE)) {
        const createTable = makeCreateTable(name, fields);
        database.prepare(createTable).run();

        const results = database.prepare(sql).all(parameters);
        resolve(results as RawRow[]);
      } else {
        reject(error);
      }
    }
  });
};

type RunResult = { affectedRows: number; lastId: number };

export const queryRun = ({ sql, parameters, name, fields }: QueryOptions) => {
  logQuery(sql, parameters);

  return new Promise<RunResult>((resolve, reject) => {
    if (!database) {
      reject('Query failed, connection is not ready. ' + sql);
      return;
    }

    try {
      const results = database.prepare(sql).run(parameters);
      resolve({
        affectedRows: results.changes,
        lastId: parseInt(`${results.lastInsertRowid}`, 10),
      });
    } catch (error) {
      if (error.message.startsWith(NO_SUCH_TABLE)) {
        console.log(makeCreateTable(name, fields));
        return; // TODO recursive.
      }

      reject(error);
    }
  });
};
