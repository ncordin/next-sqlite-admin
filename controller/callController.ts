import { CORS_HEADERS } from './cors';
import { read } from './read';
import { Controller, Method } from './types';
import { make404 } from './utils';

export async function callController(filePath: string, request: Request) {
  const file = await Bun.file(filePath);

  if ((await file.exists()) === false) {
    return make404('controller', filePath);
  }

  const controllerModule = await import(filePath);

  if (typeof controllerModule.default !== 'function') {
    return new Response('Controller function must be default export.', {
      status: 500,
    });
  }

  const controller: Controller = controllerModule.default;
  // TODO: check if method matches.

  const url = new URL(request.url); // href, protocol, host, hostname, port, search
  const requestPath = url.pathname;
  const query: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    query[key] = value;
  });
  const bodyText = await request.text();
  const body = bodyText ? JSON.parse(bodyText) : {};

  const controllerRequest = {
    url: String(request.url),
    path: requestPath,
    body,
    query,
    method: request.method as Method,
    headers: request.headers.toJSON(),
    read: (
      from: 'query' | 'body',
      name: string,
      type: 'string' | 'number' | 'boolean',
      defaultValue: unknown
    ) => {
      const value = ((from === 'query' ? query : body) || {})[name];

      if (type === 'boolean') {
        return read(value, 'boolean', defaultValue);
      }
      if (type === 'number') {
        return read(value, 'number', defaultValue);
      }
      if (type === 'string') {
        return read(value, 'string', defaultValue);
      }
    },
  };

  let responseCode = 200;

  const controllerResponse = {
    setStatusCode: (code: number) => {
      responseCode = code;
    },
  };

  console.log(`🎯 ${request.method} ${requestPath}`);

  return Promise.resolve(
    controller(controllerRequest, controllerResponse)
  ).then((value) => {
    const response = new Response(JSON.stringify(value), {
      status: responseCode,
      headers: CORS_HEADERS.headers,
    });

    console.log(`🟢 ${responseCode}`);

    return response;
  });
}
