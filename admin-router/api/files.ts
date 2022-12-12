import fileSystem from 'fs';
import { Request, Response } from 'express';
import { getError } from '../../orm/utils/error';

export const apiFiles = (request: Request, response: Response) => {
  try {
    const path = process.cwd();
    const files = fileSystem
      .readdirSync(path)
      .filter((name) => name.endsWith('.db'));

    response.statusCode = 200;
    response.json(files);
  } catch (e) {
    const error = getError(e);
    response.statusCode = 200;
    response.json({ error: { message: error.message } });
  }
};
