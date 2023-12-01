export type Options = {
  admin: {
    prefix: string;
    password: string;
  };
  api?: {
    prefix: string;
    path: string;
    cors: string;
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

type ControllerResponse = {
  setStatusCode: (code: number) => void;
};

export type Controller = (
  request: ControllerRequest,
  response: ControllerResponse
) => unknown | Promise<unknown>;
