function escapeFieldName(name) {
  return `\`${name}\``;
}

function escapeValue(value) {
  if (value === null) {
    return 'NULL';
  }

  return `'${value}'`; // TODO: escape
}

function makeAssignment(field, value) {
  if (value === null) {
    return `${escapeFieldName(field)} = NULL`;
  }

  return `${escapeFieldName(field)} = ${escapeValue(value)}`;
}

function makeEquality(field, value) {
  if (value === null) {
    return `${escapeFieldName(field)} IS NULL`;
  }

  return `${escapeFieldName(field)} = ${escapeValue(value)}`;
}

export function makeSet(row) {
  return Object.keys(row)
    .map((key) => makeAssignment(key, row[key]))
    .join(', ');
}

export function makeWhere(row) {
  return Object.keys(row)
    .map((key) => makeEquality(key, row[key]))
    .join(' AND ');
}

function makeField(field) {
  const notNull = field.canBeNull ? '' : 'NOT NULL';
  const primary = field.primaryKey ? 'PRIMARY KEY' : '';
  const increment = field.autoIncrement ? 'AUTOINCREMENT' : '';
  const defaultValue =
    field.defaultValue !== null ? `DEFAULT "${field.defaultValue}"` : '';

  return `"${field.name}" ${field.type} ${primary} ${increment} ${notNull} ${defaultValue}`;
}

export function makeFields(fields) {
  return fields.map(makeField).join(',  ');
}

export function makeDelete(table, row) {
  return `DELETE FROM \`${table}\` WHERE ${makeWhere(row)};`;
}

export function makeCreateTable(table, fields) {
  return `CREATE TABLE \`${table}\` (${makeFields(fields)});`;
}

export function makeIndex({ name, fields, isUnique, tableName }) {
  return `CREATE ${
    isUnique ? 'UNIQUE' : ''
  } INDEX "${name}" ON "${tableName}"(${fields.join(', ')});`;
}

export function makeAddField({ field, tableName }) {
  return `ALTER TABLE "${tableName}" ADD COLUMN ${makeField(field)}`;
}

export function makeRenameField({ currentName, newName, tableName }) {
  return `ALTER TABLE "${tableName}" RENAME COLUMN "${currentName}" TO "${newName}";`;
}
