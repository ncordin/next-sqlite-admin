import { Response } from 'express';

export const errorHandler = (response: Response) => (error: Error) => {
  // const message = typeof error === 'string' ? error : error.message;
  // console.log(error);

  response.json({
    error: 'Internal error!',
    message: error.toString(),
    stack: error.stack,
  });
};
