import sqlite from "better-sqlite3";
const database = sqlite("myBase.db");
database.defaultSafeIntegers(true);

const executeSql = (query, params = []) => {
  const lowerSql = query.trim().toLowerCase();

  if (lowerSql.startsWith("select ") || lowerSql.startsWith("pragma ")) {
    return database.prepare(query).all(params);
  } else {
    return [database.prepare(query).run(params)];
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
    const result = executeSql(request.body.query, request.body.params);
    const resultSafe = convertBigIntToString(result);

    response.statusCode = 200;
    response.json(resultSafe);
  } catch (error) {
    response.statusCode = 200;
    response.json({ error: error.message });
  }
};

// database.close();
