import sqlite, { Database } from 'better-sqlite3';

import { Fields } from '../fields/declaration';
import { getAndFlushParameters } from '../fields/encode';
import { makeCreateTable } from '../table/queryBuilder';
import { DatabaseConfiguration, RawRow, WriteResult } from '../types';
import { getError } from '../utils/error';
import { logQuery } from '../utils/logger';
import { readFileSync } from 'fs';

let database: Database | null = null;

const NO_SUCH_TABLE = 'no such table: ';

type QueryOptions = {
  sql: string;
  parameters: string[];
  name: string;
  fields: Fields;
  recursive?: boolean;
};

function getPackageVersion() {
  try {
    const root = __dirname.replace('/orm/drivers', '').replace('/build', '');
    const packageJsonFileRelativeToBuildPosition = `${root}/package.json`;
    const content = readFileSync(packageJsonFileRelativeToBuildPosition);
    const matches = content.toString().match(/"version": "(\d\.\d\.\d)",/);

    return matches ? matches[1] : '?';
  } catch (error) {
    return '?';
  }
}

export const initDatabase = function (config: DatabaseConfiguration) {
  database = sqlite(config.file);

  const [{ version }] = database
    .prepare('SELECT sqlite_version() AS version;')
    .all();

  console.log('');
  console.log(`💾 SQLite 95 version ${getPackageVersion()}`);
  console.log(`• Using: ${config.file}`);
  console.log(`• SQLite version ${version}`);
};

export const queryGet = ({
  sql,
  parameters,
  name,
  fields,
  recursive,
}: QueryOptions): RawRow[] => {
  logQuery(sql, parameters);

  if (!database) {
    throw new Error('Query failed, connection is not ready. ' + sql);
  }

  try {
    return database.prepare(sql).all(parameters) as RawRow[];
  } catch (e) {
    const error = getError(e);

    if (error.message.startsWith(NO_SUCH_TABLE) && !recursive) {
      const createTable = makeCreateTable(name, fields);
      const createTableParameters = getAndFlushParameters();

      logQuery(createTable, createTableParameters);
      database.prepare(createTable).run(createTableParameters);

      return queryGet({ sql, parameters, name, fields, recursive: true });
    }

    throw new Error(error.message);
  }
};

export const queryRun = ({
  sql,
  parameters,
  name,
  fields,
  recursive,
}: QueryOptions): WriteResult => {
  logQuery(sql, parameters);

  if (!database) {
    throw new Error('Query failed, connection is not ready. ' + sql);
  }

  try {
    const results = database.prepare(sql).run(parameters);

    return {
      affectedRows: results.changes,
      lastId: parseInt(`${results.lastInsertRowid}`, 10), // <- seems to be the rowId? what about auto increment?
    };
  } catch (e) {
    const error = getError(e);

    if (error.message.startsWith(NO_SUCH_TABLE) && !recursive) {
      const createTable = makeCreateTable(name, fields);
      const createTableParameters = getAndFlushParameters();

      logQuery(createTable, createTableParameters);
      database.prepare(createTable).run(createTableParameters);

      return queryRun({ sql, parameters, name, fields, recursive: true });
    }

    throw new Error(error.message);
  }
};
