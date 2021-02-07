import sqlite from "better-sqlite3";

const isClean = (file) => {
  return file.endsWith(".db");
};

export function getDatabase(file) {
  if (!isClean(file)) {
    throw new Error(`Incorrect database file: ${file}`);
  }

  const options = { fileMustExist: true };
  const database = sqlite(file, options);
  database.defaultSafeIntegers(true);

  return database;
}

export function convertBigIntToString(json) {
  const type = typeof json;

  if (json === null) {
    return json;
  }

  if (type === "bigint") {
    return json.toString();
  }

  if (type === "object" && Array.isArray(json)) {
    return json.map(convertBigIntToString);
  }

  if (type === "object") {
    return Object.keys(json).reduce((previous, current) => {
      return { ...previous, [current]: convertBigIntToString(json[current]) };
    }, {});
  }

  return json;
}
