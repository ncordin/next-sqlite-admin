import { Router, Request as ExpressRequest, Response } from 'express';

import { Controller, Route, Request, RequestData } from '../types';
import { errorHandler } from './error';
import { sanitizeJson } from './json';

const wrap =
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
          const safe = sanitizeJson(value);
          expressResponse.json(safe);
        })
        .catch(errorHandler(expressResponse));
    } catch (error) {
      errorHandler(expressResponse)(error as Error);
    }
  };

const plug = (router: Router) => (route: Route) => {
  switch (route.method) {
    case 'GET':
      router.get(route.path, wrap(route.controller));
      break;

    case 'POST':
      router.post(route.path, wrap(route.controller));
      break;

    case 'DELETE':
      router.delete(route.path, wrap(route.controller));
      break;
  }
};

export const plugAllRoutes = (router: Router) => (routes: Route[]) => {
  Object.values(routes).forEach((route) => {
    plug(router)(route);
  });
};
