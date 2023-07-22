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
  recursive?: boolean;
};

export const initDatabase = function (config: DatabaseConfiguration) {
  database = sqlite(config.file);
};

export const queryGet = ({
  sql,
  parameters,
  name,
  fields,
  recursive,
}: QueryOptions): Promise<RawRow[]> => {
  logQuery(sql, parameters);

  if (!database) {
    return Promise.reject('Query failed, connection is not ready. ' + sql);
  }

  try {
    const results = database.prepare(sql).all(parameters);

    return Promise.resolve(results as RawRow[]);
  } catch (e) {
    const error = getError(e);

    if (error.message.startsWith(NO_SUCH_TABLE) && !recursive) {
      const createTable = makeCreateTable(name, fields);
      const createTableParameters = getAndFlushParameters();

      logQuery(createTable, createTableParameters);
      database.prepare(createTable).run(createTableParameters);

      return queryGet({ sql, parameters, name, fields, recursive: true });
    }

    return Promise.reject(error);
  }
};

export const queryRun = ({
  sql,
  parameters,
  name,
  fields,
  recursive,
}: QueryOptions): Promise<WriteResult> => {
  logQuery(sql, parameters);

  if (!database) {
    return Promise.reject('Query failed, connection is not ready. ' + sql);
  }

  try {
    const results = database.prepare(sql).run(parameters);

    return Promise.resolve({
      affectedRows: results.changes,
      lastId: parseInt(`${results.lastInsertRowid}`, 10), // <- seems to be the rowId? what about auto increment?
    });
  } catch (e) {
    const error = getError(e);

    if (error.message.startsWith(NO_SUCH_TABLE) && !recursive) {
      const createTable = makeCreateTable(name, fields);
      const createTableParameters = getAndFlushParameters();

      logQuery(createTable, createTableParameters);
      database.prepare(createTable).run(createTableParameters);

      return queryRun({ sql, parameters, name, fields, recursive: true });
    }

    return Promise.reject(error);
  }
};
