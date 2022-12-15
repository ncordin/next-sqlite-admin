import { queryRun, queryGet } from '../drivers';
import { makeSet, makeWhere } from './queryBuilder';
import {
  ComparisonSymbol,
  Insertable,
  Set,
  Value,
  Where,
  WriteResult,
} from '../types';
import { Fields } from '../fields/declaration';
import { encode, encodeName, getAndFlushParameters } from '../fields/encode';
import { decodeRaws } from '../fields/decode';

type DeclarationOptions = {
  name: string;
  fields: Fields;
};

export type TableInstance<TableType> = {
  // Internal states:
  sets: Array<Set>;
  wheres: Array<Where>;

  // Setters:
  set: <Field extends keyof TableType>(
    fieldName: Field,
    value: TableType[Field]
  ) => TableInstance<TableType>;
  where: <Field extends keyof TableType>(
    fieldName: Field,
    operator: ComparisonSymbol,
    value: TableType[Field]
  ) => TableInstance<TableType>;

  // Action:
  findAll: () => Promise<TableType[]>;
  findOne: () => Promise<TableType | null>;
  insert: (data: Insertable<TableType>) => Promise<WriteResult>;
  remove: () => Promise<WriteResult>;
  update: () => Promise<WriteResult>;
};

export const declareTable = <TableType>({
  name,
  fields,
}: DeclarationOptions): TableInstance<TableType> => ({
  sets: [],
  wheres: [],

  /**
   * Set
   */
  set: function (fieldName, value) {
    const newSet: Set = {
      fieldName: String(fieldName),
      value: value as Value,
    };
    this.sets.push(newSet);
    return this;
  },

  /**
   * Where
   */
  where: function (fieldName, comparison, value) {
    const newWhere: Where = {
      fieldName: String(fieldName),
      comparison,
      value: value as Value,
    };
    this.wheres.push(newWhere);
    return this;
  },

  /**
   * FindAll
   */
  findAll: function () {
    const condition = makeWhere(name, fields, this.wheres);
    const sql = `SELECT * FROM ${encodeName(name)} WHERE ${condition};`;
    const parameters = getAndFlushParameters();

    this.wheres = [];

    return queryGet({ sql, parameters, name, fields }).then((rows) =>
      decodeRaws<TableType>(rows, fields)
    );
  },

  /**
   * FindOne
   */
  findOne: function () {
    return this.findAll().then((rows) => (rows.length ? rows[0] : null));
  },

  /**
   * Insert
   */
  insert: function (data: Insertable<TableType>) {
    const fieldNames = Object.keys(data)
      .map((field) => encodeName(field))
      .join(', ');

    const values = Object.entries(data)
      .map(([field, value]) => encode(value as Value, fields[field]))
      .join(', ');

    const sql = `INSERT INTO ${encodeName(
      name
    )} (${fieldNames}) VALUES (${values});`;

    const parameters = getAndFlushParameters();

    return queryRun({ sql, parameters, name, fields });
  },

  /**
   * Remove
   */
  remove: function () {
    if (this.wheres.length === 0) {
      throw new Error('Refused to flush the table to avoid disaster.');
    }

    const condition = makeWhere(name, fields, this.wheres);
    const sql = `DELETE FROM ${encodeName(name)} WHERE ${condition};`;
    const parameters = getAndFlushParameters();

    this.wheres = [];

    return queryRun({ sql, parameters, name, fields });
  },

  /**
   * Update
   */
  update: function () {
    const set = makeSet(name, fields, this.sets);
    const condition = makeWhere(name, fields, this.wheres);
    const sql = `UPDATE ${encodeName(name)} SET ${set} WHERE ${condition};`;
    const parameters = getAndFlushParameters();

    this.sets = [];
    this.wheres = [];

    return queryRun({ sql, parameters, name, fields });
  },

  /**
   * Sql
   */
  // const sql = (sqlString: string) => {
  //   return { _SQL: sqlString };
  // };
});
