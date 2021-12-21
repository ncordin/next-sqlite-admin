import { Response } from 'express';

export const errorHandler = (response: Response) => (error: Error) => {
  response.status(500);
  response.json({
    message: error.toString(),
    stack: error.stack || '',
  });
};
