import { Request, Response } from 'express';
import { getError } from '../../orm/utils/error';
import { getDatabase } from '../utils';

const executeSql = (
  databaseName: string,
  query: string,
  params: string[] = []
) => {
  const database = getDatabase(databaseName);
  const lowerSql = query.trim().toLowerCase();

  if (lowerSql.startsWith('select ') || lowerSql.startsWith('pragma ')) {
    return database.query(query).all(...params);
  } else {
    return [database.query(query).run(...params)];
  }
};

export const apiSql = (request: Request, response: Response) => {
  try {
    const result = executeSql(
      request.headers.database?.toString() || '',
      request.body.query,
      request.body.params
    );

    response.statusCode = 200;
    response.json(result);
  } catch (e) {
    const error = getError(e);
    response.statusCode = 200;
    response.json({ error: { title: 'SQL error!', message: error.message } });
  }
};
