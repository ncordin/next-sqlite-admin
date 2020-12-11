import sqlite from "better-sqlite3";
const database = sqlite("myBase.db");
database.defaultSafeIntegers(true);

const executeSql = (sql) => {
  const lowerSql = sql.trim().toLowerCase();

  if (lowerSql.startsWith("select ")) {
    return database.prepare(sql).all();
  } else {
    return [database.prepare(sql).run()];
  }
};

const convertBigIntToString = (result) => {
  return result.map((row) => {
    return Object.keys(row).reduce((previous, current) => {
      const value = row[current];
      const newValue = typeof value === "bigint" ? value.toString() : value;

      return {
        ...previous,
        [current]: newValue,
      };
    }, {});
  });
};

export default (request, response) => {
  try {
    const result = executeSql(request.body.sql);
    const resultSafe = convertBigIntToString(result);

    response.statusCode = 200;
    response.json(resultSafe);
  } catch (error) {
    response.statusCode = 200;
    response.json({ error: error.message });
  }
};

// database.close();
