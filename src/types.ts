type Method = 'GET' | 'POST' | 'DELETE';

export type RequestData = { [key: string]: string | undefined };

export type Request = {
  headers: RequestData;
  params: RequestData;
  ip: string;
};

export type Controller = (request: Request) => Promise<unknown>;

export type Route = {
  method: Method;
  path: string;
  controller: Controller;
};

export type DatabaseConfiguration = {
  file: string;
};

export type RawRow = {
  [key: string]: string;
};
