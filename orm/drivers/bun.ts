import { Database } from 'bun:sqlite';
import { readFileSync } from 'fs';

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

function getPackageVersion() {
  try {
    const root = __dirname.replace('/orm/drivers', '');
    const packageJsonFileRelativeToBuildPosition = `${root}/package.json`;
    const content = readFileSync(packageJsonFileRelativeToBuildPosition);
    const matches = content.toString().match(/"version": "(\d\.\d\.\d)",/);

    return matches ? matches[1] : '?';
  } catch (error) {
    return '?';
  }
}

export const initDatabase = function (config: DatabaseConfiguration) {
  database = new Database(config.file);

  const [{ version }] = database
    .query<{ version: string }, null>('SELECT sqlite_version() AS version;')
    .all(null);

  console.log('');
  console.log(`💾 SQLite 95 version ${getPackageVersion()}`);
  console.log(`• Using: ${config.file}`);
  console.log(`• SQLite version ${version}\n`);
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
    return database.query<RawRow, string[]>(sql).all(...parameters);
  } catch (e) {
    const error = getError(e);

    if (error.message.startsWith(NO_SUCH_TABLE) && !recursive) {
      const createTable = makeCreateTable(name, fields);
      const createTableParameters = getAndFlushParameters();

      logQuery(createTable, createTableParameters);
      database.query(createTable).run(...createTableParameters);

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
    database.query(sql).run(...parameters);

    const result = database.query('SELECT CHANGES() as `changes`;').get() as {
      changes: number;
    };

    return {
      affectedRows: result.changes,
    };
  } catch (e) {
    const error = getError(e);

    if (error.message.startsWith(NO_SUCH_TABLE) && !recursive) {
      const createTable = makeCreateTable(name, fields);
      const createTableParameters = getAndFlushParameters();

      logQuery(createTable, createTableParameters);
      database.query(createTable).run(...createTableParameters);

      return queryRun({ sql, parameters, name, fields, recursive: true });
    }

    throw new Error(error.message);
  }
};
