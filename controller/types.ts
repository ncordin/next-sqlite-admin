export type Options = {
  prefix?: string;
  admin: {
    prefix: string;
    password: string;
  };
  api?: {
    prefix: string;
    path: string;
    cors: string;
    middleware?: Middleware;
  };
  assets?: {
    prefix: string;
    path: string;
  }[];
};

type Headers = {
  'accept-encoding'?: string;
  'accept-language'?: string;
  'content-length'?: string;
  'content-type'?: string;
  'user-agent'?: string;
  accept?: string;
  cookie?: string;
  connection?: string;
  host?: string;
  referer?: string;
  [key: string]: string | undefined;
};

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type Body = { [key: string]: string | number | boolean | null };

function read<T>(
  from: 'query' | 'body',
  name: string,
  type: 'string',
  defaultValue: T
): string | T;
function read<T>(
  from: 'query' | 'body',
  name: string,
  type: 'number',
  defaultValue: T
): number | T;
function read<T>(
  from: 'query' | 'body',
  name: string,
  type: 'boolean',
  defaultValue: T
): boolean | T;
function read<T>(
  from: 'query' | 'body',
  name: string,
  type: 'string' | 'number' | 'boolean',
  defaultValue: T
) {}

type ControllerRequest = {
  url: string;
  path: string;
  body: Body;
  query: Record<string, string>;
  method: Method;
  headers: Headers;
  read: typeof read;
};

export type ContentType = 'json' | 'html' | 'text';

type ControllerResponse = {
  setStatusCode: (code: number) => void;
  setContentType: (type: ContentType) => void;
};

type JsonValue =
  | string
  | number
  | boolean
  | null
  | Date
  | JsonValue[]
  | { [key: string]: JsonValue };

export type Controller = (
  request: ControllerRequest,
  response: ControllerResponse
) => JsonValue | Promise<JsonValue>;

export type Middleware = (
  request: ControllerRequest,
  response: ControllerResponse
) => JsonValue | undefined;
