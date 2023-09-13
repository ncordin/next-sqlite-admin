import { Database } from 'bun:sqlite';
import { existsSync } from 'node:fs';

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
  if (!isClean(file) || !existsSync(file)) {
    throw new Error(`Incorrect database file: ${file}`);
  }

  const database = new Database(file);

  return database;
}
