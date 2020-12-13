import sqlite from "better-sqlite3";
const database = sqlite("myBase.db");

const countLines = (tableName) => {
  const result = database.prepare(`SELECT COUNT(*) FROM ${tableName}`).get();

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

const getStructure = (tableName) => {
  return database.pragma(`table_info('${tableName}')`).map((tableInfo) => ({
    name: tableInfo.name,
    type: tableInfo.type,
    canBeNull: !tableInfo.notnull,
    defaultValue: tableInfo.dflt_value && removeQuotes(tableInfo.dflt_value),
    isPrimaryKey: !!tableInfo.pk,
  }));
};

const getTables = () => {
  const tables = database
    .prepare(
      "SELECT * FROM sqlite_master WHERE `type`='table' ORDER BY `name` ASC;"
    )
    .all();

  const data = tables.map((table) => ({
    name: table.name,
    lines: countLines(table.name),
    structure: getStructure(table.name),
  }));

  return data;
};

export default (request, response) => {
  const tables = getTables();

  response.statusCode = 200;
  response.json(tables);
};

// database.close();
