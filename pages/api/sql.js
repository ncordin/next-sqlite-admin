import sqlite from "better-sqlite3";
const database = sqlite("myBase.db");

const executeSql = (sql) => {
  const lowerSql = sql.trim().toLowerCase();

  if (lowerSql.startsWith("select ")) {
    return database.prepare(sql).all();
  } else {
    return [database.prepare(sql).run()];
  }
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
