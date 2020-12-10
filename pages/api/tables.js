import sqlite from "better-sqlite3";
const database = sqlite("myBase.db");

// const create = database
//   .prepare("CREATE TABLE players (id INT, name TEXT, gold INT)")
//   .run();

// const insert = database.prepare("INSERT INTO players VALUES (?, ?, ?)");
// for (var i = 0; i < 10; i++) {
//   insert.run(i, `Name ${i}`, 100);
// }

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
