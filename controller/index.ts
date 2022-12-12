import { Request as ExpressRequest, Response } from 'express';

import { Controller, Request, RequestData } from './types';

const errorHandler = (response: Response) => (error: Error) => {
  response.status(500);
  response.json({
    message: error.toString(),
    stack: error.stack || '',
  });
};

export const wrapController =
  (controller: Controller) =>
  (expressRequest: ExpressRequest, expressResponse: Response) => {
    const params = {
      ...expressRequest.query,
      ...expressRequest.body,
      ...expressRequest.params,
    };

    const request: Request = {
      headers: expressRequest.headers as RequestData,
      params,
      ip: expressRequest.ip,
    };

    try {
      controller(request)
        .then((value) => {
          expressResponse.json(value);
        })
        .catch(errorHandler(expressResponse));
    } catch (error) {
      errorHandler(expressResponse)(error as Error);
    }
  };
