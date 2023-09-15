import fileSystem from 'fs';
import { HTTPRequest, HTTPResponse } from '../../controller/types';
import { getError } from '../../orm/utils/error';

export const apiFiles = (request: HTTPRequest, response: HTTPResponse) => {
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
