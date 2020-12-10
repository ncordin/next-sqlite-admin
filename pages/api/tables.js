import sqlite from "better-sqlite3";
const database = sqlite("myBase.db");

const countLines = (tableName) => {
  const result = database.prepare(`SELECT COUNT(*) FROM ${tableName}`).get();

  return result["COUNT(*)"];
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
  }));

  return data;
};

export default (request, response) => {
  const tables = getTables();

  response.statusCode = 200;
  response.json(tables);
};

// database.close();
