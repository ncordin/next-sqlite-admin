import sqlite, { Database } from 'better-sqlite3';

import { Fields } from '../fields/declaration';
import { getAndFlushParameters } from '../fields/encode';
import { makeCreateTable } from '../table/queryBuilder';
import { DatabaseConfiguration, RawRow, WriteResult } from '../types';
import { getError } from '../utils/error';
import { logQuery } from '../utils/logger';

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
    } catch (e) {
      const error = getError(e);

      if (error.message.startsWith(NO_SUCH_TABLE)) {
        const createTable = makeCreateTable(name, fields);
        const createTableParameters = getAndFlushParameters();

        database.prepare(createTable).run(createTableParameters);

        const results = database.prepare(sql).all(parameters);
        resolve(results as RawRow[]);
      } else {
        reject(error);
      }
    }
  });
};

type RunResult = { affectedRows: number; lastId: number };

export const queryRun = ({
  sql,
  parameters,
  name,
  fields,
}: QueryOptions): Promise<WriteResult> => {
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
        lastId: parseInt(`${results.lastInsertRowid}`, 10), // <- seems to be the rowId? what about auto increment?
      });
    } catch (e) {
      const error = getError(e);
      if (error.message.startsWith(NO_SUCH_TABLE)) {
        const createTable = makeCreateTable(name, fields);
        const createTableParameters = getAndFlushParameters();

        database.prepare(createTable).run(createTableParameters);

        return; // TODO recursive.
      }

      reject(error);
    }
  });
};
