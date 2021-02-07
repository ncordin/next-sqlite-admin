import { Request, Response } from 'express';
import { Database } from 'better-sqlite3';

import { convertBigIntToString, getDatabase } from '../utils';

const countLines = (database: Database, tableName: string) => {
  const result = database.prepare(`SELECT COUNT(*) FROM "${tableName}"`).get();

  return result['COUNT(*)'];
};

const removeQuotes = (string: string) => {
  for (const quote of ['"', "'", '`']) {
    if (string.startsWith(quote) && string.endsWith(quote)) {
      return string.slice(1, -1);
    }
  }

  return string;
};

const getStructure = (database: Database, tableName: string) => {
  return (
    database
      .pragma(`table_info('${tableName}')`)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((tableInfo: any) => ({
        name: tableInfo.name,
        type: tableInfo.type,
        canBeNull: !tableInfo.notnull,
        defaultValue:
          tableInfo.dflt_value && removeQuotes(tableInfo.dflt_value),
        isPrimaryKey: !!tableInfo.pk,
      }))
  );
};

const getTables = (database: Database) => {
  const tables = database
    .prepare(
      "SELECT * FROM sqlite_master WHERE `type`='table' ORDER BY `name` ASC;"
    )
    .all();

  return tables.map((table) => ({
    name: table.name,
    lines: countLines(database, table.name),
    structure: getStructure(database, table.name),
    describe: table.sql,
  }));
};

export const apiTables = (request: Request, response: Response) => {
  try {
    const database = getDatabase(request.headers.database?.toString() || '');
    const tables = getTables(database);
    const safeJson = convertBigIntToString(tables);

    response.statusCode = 200;
    response.json(safeJson);
  } catch (error) {
    response.statusCode = 200;
    response.json({ error: { message: error.message } });
  }
};
