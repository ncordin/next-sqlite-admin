import sqlite from "better-sqlite3";
const database = sqlite("myBase.db");

const executeSql = (sql) => {
  return database.prepare(sql).all();
};

export default (request, response) => {
  try {
    const result = executeSql(request.body.sql);

    response.statusCode = 200;
    response.json(result);
  } catch (error) {
    response.statusCode = 200;
    response.json({ error: error.message });
  }
};

// database.close();
