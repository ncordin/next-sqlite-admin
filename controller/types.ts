type Headers = {
  'content-length': string;
  'content-type': string;
  'user-agent': string;
  accept: string;
  connection: string;
  host: string;
  [key: string]: string;
};

type On = (event: string, handler: (data?: any) => void) => { on: On };

export type HTTPRequest = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  path: string;
  search: string;
  headers: Headers;
  _parsedUrl: { query: { [key: string]: string } };
  on: On;
  // Added by custom middlewares:
  body: { [key: string]: string | number | boolean | null };
};

export type HTTPResponse = {
  statusCode: number;
  setHeader: (name: string, value: string) => void;
  end: (data?: unknown) => void;
};

type ControllerRequest = {
  url: string;
  path: string;
  body: HTTPRequest['body'];
  query: HTTPRequest['_parsedUrl']['query'];
  method: HTTPRequest['method'];
  headers: Headers;
};

type ControllerResponse = {
  setStatusCode: (code: number) => void;
};

export type Controller = (
  request: ControllerRequest,
  response: ControllerResponse
) => unknown | Promise<unknown>;
