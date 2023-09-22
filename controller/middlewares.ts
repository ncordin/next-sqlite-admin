import { HTTPRequest, HTTPResponse } from './types';

export const requestQuery =
  () =>
  (
    request: { _parsedUrl: { query: unknown }; query: unknown },
    response: HTTPResponse,
    next: () => void
  ) => {
    request.query = request._parsedUrl.query;
    next();
  };

export const requestBody =
  () =>
  (
    request: HTTPRequest<string | {}>,
    response: HTTPResponse,
    next: () => void
  ) => {
    if (request.method === 'POST') {
      const body: Uint8Array[] = [];
      request
        .on('data', (chunk) => {
          // TODO: limit the size to avoid problems.
          body.push(chunk);
        })
        .on('end', () => {
          const fullBody = Buffer.concat(body).toString();

          if (request.headers['content-type'] === 'application/json') {
            if (fullBody.trim()) {
              try {
                const json = JSON.parse(fullBody);
                request.body = json;
              } catch (e) {
                response.statusCode = 400;
                response.end('Invalid JSON');
              }
            } else {
              request.body = {};
            }
          } else {
            request.body = fullBody;
          }

          next();
        })
        .on('error', (error) => {
          console.error(error);
          response.statusCode = 400;
          response.end();
        });
    } else {
      next();
    }
  };

export const jsonResponse =
  () => (request: HTTPRequest, response: HTTPResponse, next: () => void) => {
    response.json = (payload) => {
      response.setHeader('Content-Type', 'application/json');
      const jsonResponse = JSON.stringify(payload);
      response.end(jsonResponse);
    };
    next();
  };
