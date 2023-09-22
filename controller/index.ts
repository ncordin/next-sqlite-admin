import { Controller, HTTPResponse, Request } from './types';

const errorHandler = (response: HTTPResponse) => (error: Error) => {
  response.statusCode = 500;
  response.json({
    message: error.toString(),
    stack: error.stack || '',
  });
};

type RequestHandler = (
  httpRequest: any, // Must fit into other libs (express / polka) Request types.
  httpResponse: any // Same for the response.
) => void;

type Wrapper = (controller: Controller) => RequestHandler;

export const wrapController: Wrapper =
  (controller) => (httpRequest, httpResponse) => {
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
