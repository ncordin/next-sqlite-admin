/**
 * Number
 */
type NumberField = {
  type: 'integer';
  canBeNull: boolean;
  default: number | null;
  primaryKey: boolean;
  autoIncrement: boolean;
};

export const number = (options: {
  canBeNull?: boolean;
  default?: number | null;
  primaryKey?: boolean;
  autoIncrement?: boolean;
}): NumberField => {
  return {
    type: 'integer',
    canBeNull: options.canBeNull || false,
    default: options.default || null,
    primaryKey: options.primaryKey || false,
    autoIncrement: options.autoIncrement || false,
  };
};

/**
 * String
 */
type StringField = {
  type: 'string';
  maxLength: number;
  canBeNull: boolean;
  default: string | null;
  primaryKey: boolean;
};

export const string = (options: {
  maxLength: number;
  canBeNull?: boolean;
  default?: string | null;
  primaryKey?: boolean;
}): StringField => {
  return {
    type: 'string',
    maxLength: options.maxLength,
    canBeNull: options.canBeNull || false,
    default: options.default || null,
    primaryKey: options.primaryKey || false,
  };
};

/**
 * Boolean
 */
type BooleanField = {
  type: 'boolean';
  canBeNull: boolean;
  default: boolean | null;
  primaryKey: boolean;
};

export const boolean = (options: {
  canBeNull?: boolean;
  default?: boolean | null;
  primaryKey?: boolean;
}): BooleanField => {
  return {
    type: 'boolean',
    canBeNull: options.canBeNull || false,
    default: options.default || null,
    primaryKey: options.primaryKey || false,
  };
};

/**
 * Enumerated
 */
type EnumeratedField<T extends string> = {
  type: 'enumerated';
  values: T[];
  canBeNull: boolean;
  default: string | null;
  primaryKey: boolean;
};

export const enumerated = <T extends string>(options: {
  values: T[];
  canBeNull?: boolean;
  default?: string | null;
  primaryKey?: boolean;
}): EnumeratedField<T> => {
  return {
    type: 'enumerated',
    values: options.values,
    canBeNull: options.canBeNull || false,
    default: options.default || null,
    primaryKey: options.primaryKey || false,
  };
};

/**
 * DateTime
 */
type DateTimeField = {
  type: 'datetime';
  canBeNull: boolean;
  default: Date | null;
  primaryKey: boolean;
};

export const dateTime = (options: {
  canBeNull?: boolean;
  default?: Date | null;
  primaryKey?: boolean;
}): DateTimeField => {
  return {
    type: 'datetime',
    canBeNull: options.canBeNull || false,
    default: options.default || null,
    primaryKey: options.primaryKey || false,
  };
};

/**
 * Any Field
 */
export type AnyField =
  | NumberField
  | StringField
  | BooleanField
  | EnumeratedField<any>
  | DateTimeField;

export type Fields = {
  [key: string]: AnyField;
};

type TypeOfField<Field> = Field extends NumberField
  ? number
  : Field extends StringField
  ? string
  : Field extends BooleanField
  ? boolean
  : Field extends EnumeratedField<any>
  ? Field['values']
  : Field extends DateTimeField
  ? Date
  : never;

export type InferFromFields<Fields extends { [key: string]: AnyField }> = {
  [key in keyof Fields]: TypeOfField<Fields[key]>;
};
