import fileSystem from 'fs';
import { Controller } from '../..';
import { getError } from '../../orm/utils/error';

export const apiFiles: Controller = () => {
  try {
    const path = process.cwd();
    const files = fileSystem
      .readdirSync(path)
      .filter((name) => name.endsWith('.db'));

    return files;
  } catch (e) {
    const error = getError(e);

    return { error: { message: error.message } };
  }
};
