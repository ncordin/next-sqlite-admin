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

export function makeDelete(table, row) {
  return `DELETE FROM \`${table}\` WHERE ${makeWhere(row)};`;
}
