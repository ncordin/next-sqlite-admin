import { queryRun, queryGet } from './connection';
import { makeSet, makeWhere } from './queryBuilder';
import { SetOfComparisonValues, Value, ComparisonValue } from './types';
import { Fields } from './declaration';
import { encode, encodeName, getAndFlushParameters } from './formatters/encode';
import { decodeRaws } from './formatters/decode';

type DeclarationOptions = {
  name: string;
  fields: Fields;
};

export type Insertable<TableType> = {
  [PropertyType in keyof TableType]: TableType[PropertyType] | { _SQL: string };
};

type Options<WhereField extends string | number | symbol> = {
  where?: { [key in WhereField]: ComparisonValue };
};

type UpdateOptions<
  SetField extends string | number | symbol,
  WhereField extends string | number | symbol
> = {
  set: { [key in SetField]: Value };
  where?: { [key in WhereField]: ComparisonValue };
};

export const declareTable = <TableType>({
  name,
  fields,
}: DeclarationOptions) => {
  /**
   * FindAll
   */
  const findAll = <Field extends keyof TableType>(options: Options<Field>) => {
    const condition = makeWhere(
      name,
      fields,
      options.where as SetOfComparisonValues
    );
    const sql = `SELECT * FROM ${encodeName(name)} WHERE ${condition};`;
    const parameters = getAndFlushParameters();

    return queryGet({ sql, parameters, name, fields }).then((rows) =>
      decodeRaws<TableType>(rows, fields)
    );
  };

  /**
   * FindOne
   */
  const findOne = <Field extends keyof TableType>(options: Options<Field>) => {
    return findAll(options).then((rows) => (rows.length ? rows[0] : null));
  };

  /**
   * Insert
   */
  const insert = (data: Insertable<TableType>) => {
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
  };

  /**
   * Remove
   */
  const remove = <Field extends keyof TableType>(options: Options<Field>) => {
    const condition = makeWhere(
      name,
      fields,
      options.where as SetOfComparisonValues
    );
    const sql = `DELETE FROM ${encodeName(name)} WHERE ${condition};`;
    const parameters = getAndFlushParameters();

    return queryRun({ sql, parameters, name, fields });
  };

  /**
   * Update
   */
  const update = <
    SetField extends keyof TableType,
    WhereField extends keyof TableType
  >(
    options: UpdateOptions<SetField, WhereField>
  ) => {
    const set = makeSet(name, fields, options.set);
    const condition = makeWhere(
      name,
      fields,
      options.where as SetOfComparisonValues
    );
    const sql = `UPDATE ${encodeName(name)} SET ${set} WHERE ${condition};`;
    const parameters = getAndFlushParameters();

    return queryRun({ sql, parameters, name, fields });
  };

  /**
   * Sql
   */
  const sql = (sqlString: string) => {
    return { _SQL: sqlString };
  };

  return {
    findAll,
    findOne,
    insert,
    remove,
    update,
    sql,
  };
};
