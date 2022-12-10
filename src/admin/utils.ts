import sqlite, { Database } from 'better-sqlite3';

const isClean = (file: string) => {
  if (file.includes('/')) {
    return false;
  }

  if (file.includes('..')) {
    return false;
  }

  return file.endsWith('.db');
};

export function getDatabase(file: string): Database {
  if (!isClean(file)) {
    throw new Error(`Incorrect database file: ${file}`);
  }

  const options = { fileMustExist: true };
  const database = sqlite(file, options);

  return database;
}
