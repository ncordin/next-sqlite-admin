export type Value = number | string | boolean | Date | null | { _SQL: string };

export type ComparisonSymbol = '<' | '<=' | '>' | '>=' | '=' | '!=';

export type Set = {
  fieldName: string;
  value: Value;
};

export type Where = {
  fieldName: string;
  comparison: ComparisonSymbol;
  value: Value;
};

export type RawRow = {
  [key: string]: string;
};

export type DatabaseConfiguration = {
  file: string;
};

export type WriteResult = {
  affectedRows: number;
  lastId: number;
};

export type Insertable<TableType> = {
  [PropertyType in keyof TableType]: TableType[PropertyType] | { _SQL: string };
};
