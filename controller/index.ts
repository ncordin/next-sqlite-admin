import { Controller, HTTPRequest, HTTPResponse, Request } from './types';

const errorHandler = (response: HTTPResponse) => (error: Error) => {
  response.statusCode = 500;
  response.json({
    message: error.toString(),
    stack: error.stack || '',
  });
};

export const wrapController =
  (controller: Controller) =>
  (httpRequest: HTTPRequest<{}>, httpResponse: HTTPResponse) => {
    const params = {
      ...(httpRequest.query || {}),
      ...(httpRequest.body || {}),
    };

    const request: Request = {
      headers: httpRequest.headers,
      params,
    };

    try {
      Promise.resolve(controller(request))
        .then((value) => {
          httpResponse.json(value);
        })
        .catch(errorHandler(httpResponse));
    } catch (error) {
      errorHandler(httpResponse)(error as Error);
    }
  };
