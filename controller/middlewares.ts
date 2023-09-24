import { HTTPRequest, HTTPResponse } from './types';

export const requestJsonBody =
  () => (request: HTTPRequest, response: HTTPResponse, next: () => void) => {
    if (
      request.method === 'POST' &&
      request.headers['content-type'] === 'application/json'
    ) {
      const body: Uint8Array[] = [];
      request
        .on('data', (chunk) => {
          // TODO: limit the size to avoid problems.
          body.push(chunk);
        })
        .on('end', () => {
          const rawBody = Buffer.concat(body).toString();

          if (rawBody.trim()) {
            try {
              const json = JSON.parse(rawBody);
              request.body = json;
            } catch (e) {
              response.statusCode = 400;
              response.end('Invalid JSON');
            }
          } else {
            request.body = {};
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
