export function makeSet(row) {
  return Object.keys(row)
    .map((key) => `\`${key}\` = '${row[key]}'`)
    .join(", ");
}

export function makeWhere(row) {
  return Object.keys(row)
    .map((key) => `\`${key}\` = '${row[key]}'`)
    .join(" AND ");
}

export function makeFields(fields) {
  return fields
    .map((field) => {
      const notNull = field.canBeNull ? "" : "NOT NULL";
      const primary = field.primaryKey ? "PRIMARY KEY" : "";
      const increment = field.autoIncrement ? "AUTOINCREMENT" : "";
      const defaultValue =
        field.defaultValue !== null ? `DEFAULT "${field.defaultValue}"` : "";

      return `\`${field.name}\` ${field.type} ${primary} ${increment} ${notNull} ${defaultValue}`;
    })
    .join(",  ");
}

export function makeDelete(table, row) {
  return `DELETE FROM \`${table}\` WHERE ${makeWhere(row)};`;
}

export function makeCreateTable(table, fields) {
  return `CREATE TABLE \`${table}\` (${makeFields(fields)});`;
}
