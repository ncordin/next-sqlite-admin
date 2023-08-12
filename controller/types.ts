export type RequestData = { [key: string]: string | undefined };

export type Request = {
  headers: RequestData;
  params: RequestData;
  ip: string;
};

export type Controller = (request: Request) => unknown | Promise<unknown>;
