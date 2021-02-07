export type Value = number | string | null | { _SQL: string };

export type ComparisonSymbol = '<' | '<=' | '>' | '>=' | '=';

export type ComparisonValue = Partial<Record<ComparisonSymbol, Value>> | Value;

export type SetOfValues = Record<string, Value>;

export type SetOfComparisonValues = Record<string, ComparisonValue>;
