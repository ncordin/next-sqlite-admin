export type RawSQL = { _SQL: string };

export type Value = number | string | boolean | Date | null | RawSQL;

export type ComparisonSymbol = '<' | '<=' | '>' | '>=' | '=' | '!=' | 'LIKE';

export type Set = {
  fieldName: string;
  value: Value;
};

export type Where = {
  fieldName: string;
  comparison: ComparisonSymbol;
  value: Value;
};

export type OrderBy = {
  fieldName: string;
  direction: 'ASC' | 'DESC';
};

export type Limit = {
  quantity: number;
  position?: number;
};

export type RawRow = {
  [key: string]: string;
};

export type DatabaseConfiguration = {
  file: string;
};

export type WriteResult = {
  affectedRows: number;
};

export type Insertable<TableType> = {
  [PropertyType in keyof TableType]: TableType[PropertyType] | RawSQL;
};
