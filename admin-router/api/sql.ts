import { Controller } from '../../controller/types';
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

const controller: Controller = (request, response) => {
  // Think about a tool to check data and apply types:
  const params = request.body.params as unknown as string[];

  try {
    const result = executeSql(
      String(request.headers.database),
      String(request.body.query),
      params
    );

    response.setStatusCode(202);
    return result;
  } catch (e) {
    const error = getError(e);

    return { error: { title: 'SQL error!', message: error.message } };
  }
};

export default controller;
