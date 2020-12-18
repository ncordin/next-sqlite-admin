import { convertBigIntToString, getDatabase } from "../../server/utils";

const countLines = (database, tableName) => {
  const result = database.prepare(`SELECT COUNT(*) FROM "${tableName}"`).get();

  return result["COUNT(*)"];
};

const removeQuotes = (string) => {
  for (const quote of ['"', "'", "`"]) {
    if (string.startsWith(quote) && string.endsWith(quote)) {
      return string.slice(1, -1);
    }
  }

  return string;
};

const getStructure = (database, tableName) => {
  return database.pragma(`table_info('${tableName}')`).map((tableInfo) => ({
    name: tableInfo.name,
    type: tableInfo.type,
    canBeNull: !tableInfo.notnull,
    defaultValue: tableInfo.dflt_value && removeQuotes(tableInfo.dflt_value),
    isPrimaryKey: !!tableInfo.pk,
  }));
};

const getTables = (database) => {
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

export default (request, response) => {
  try {
    const database = getDatabase(request.headers.database);
    const tables = getTables(database);
    const safeJson = convertBigIntToString(tables);

    response.statusCode = 200;
    response.json(safeJson);
  } catch (error) {
    response.statusCode = 200;
    response.json({ error: { message: error.message } });
  }
};
