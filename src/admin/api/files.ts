import fileSystem from 'fs';
import { Request, Response } from 'express';

export const apiFiles = (request: Request, response: Response) => {
  try {
    const path = process.cwd();
    const files = fileSystem
      .readdirSync(path)
      .filter((name) => name.endsWith('.db'));

    response.statusCode = 200;
    response.json(files);
  } catch (error) {
    response.statusCode = 200;
    response.json({ error: { message: error.message } });
  }
};
