import { Request, Response } from 'express';
import { convertBigIntToString, getDatabase } from '../utils';

const executeSql = (databaseName: string, query: string, params = []) => {
  const database = getDatabase(databaseName);
  const lowerSql = query.trim().toLowerCase();

  if (lowerSql.startsWith('select ') || lowerSql.startsWith('pragma ')) {
    return database.prepare(query).all(params);
  } else {
    return [database.prepare(query).run(params)];
  }
};

export const apiSql = (request: Request, response: Response) => {
  try {
    const result = executeSql(
      request.headers.database?.toString() || '',
      request.body.query,
      request.body.params
    );
    const resultSafe = convertBigIntToString(result);

    response.statusCode = 200;
    response.json(resultSafe);
  } catch (error) {
    response.statusCode = 200;
    response.json({ error: { title: 'SQL error!', message: error.message } });
  }
};
