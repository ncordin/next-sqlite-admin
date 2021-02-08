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
  database.defaultSafeIntegers(true);

  return database;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertBigIntToString(json: any): any {
  if (json === null) {
    return json;
  }

  if (typeof json === 'bigint') {
    return json.toString();
  }

  if (typeof json === 'object' && Array.isArray(json)) {
    return json.map(convertBigIntToString);
  }

  if (typeof json === 'object' && json !== null) {
    return Object.keys(json).reduce((previous, current) => {
      return {
        ...previous,
        [current]: convertBigIntToString(json[current]),
      };
    }, {});
  }

  return json;
}
