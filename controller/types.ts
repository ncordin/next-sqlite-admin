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

export type HTTPRequest<BodyType = null> = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  path: string;
  search: string;
  _parsedUrl: {
    query: { [key: string]: string };
  };
  body: BodyType;
  headers: Headers;
  on: On;
};

export type HTTPResponse = {
  statusCode: number;
  setHeader: (name: string, value: string) => void;
  json: (data: unknown) => void;
  end: (data?: unknown) => void;
};

export type Request = {
  headers: Headers;
  params: { [key: string]: string | undefined };
};

export type Controller = (request: Request) => unknown | Promise<unknown>;
