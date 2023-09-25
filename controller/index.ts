import { Controller, HTTPRequest, HTTPResponse } from './types';

const errorHandler = (response: HTTPResponse) => (error: Error) => {
  response.statusCode = 500;
  response.setHeader('Content-Type', 'application/json');
  response.end(
    JSON.stringify({
      message: error.toString(),
      stack: error.stack || '',
    })
  );
};

type RequestHandler = (
  httpRequest: any, // Must fit into other libs (express / polka) Request types.
  httpResponse: any // Same for the response.
) => void;

type Wrapper = (controller: Controller) => RequestHandler;

export const wrapController: Wrapper =
  (controller) => (httpRequest: HTTPRequest, httpResponse: HTTPResponse) => {
    const request = {
      url: httpRequest.url,
      path: httpRequest.path,
      body: httpRequest.body || {},
      query: httpRequest._parsedUrl.query || {},
      method: httpRequest.method,
      headers: httpRequest.headers,
    };

    let responseCode = 200;

    const response = {
      setStatusCode: (code: number) => {
        responseCode = code;
      },
    };

    console.log(`🎯 ${request.method} ${request.path}`);

    try {
      Promise.resolve(controller(request, response))
        .then((value) => {
          httpResponse.statusCode = responseCode;
          httpResponse.setHeader('Content-Type', 'application/json');
          httpResponse.end(JSON.stringify(value));

          console.log(`🟢 ${responseCode}\n`);
        })
        .catch(errorHandler(httpResponse));
    } catch (error) {
      console.log(`🔴 500 caught by wrapController`);
      console.log(error); // Show in server console.
      errorHandler(httpResponse)(error as Error);
    }
  };
