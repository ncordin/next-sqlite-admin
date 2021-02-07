import sqlite, { Database } from 'better-sqlite3';
import { DatabaseConfiguration, RawRow } from '../types';
import { logQuery } from '../utils/logger';

let database: Database | null = null;

export const initDatabase = function (config: DatabaseConfiguration) {
  database = sqlite(config.file);
  database.defaultSafeIntegers(true);
};

export const queryGet = (sql: string, parameters: string[]) => {
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
      reject(error);
    }
  });
};

type RunResult = { affectedRows: number; lastId: number };

export const queryRun = (sql: string, parameters: string[]) => {
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
      reject(error);
    }
  });
};
