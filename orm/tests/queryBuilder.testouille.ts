import { Table } from '..';
import { makeCreateTable } from '../table/queryBuilder';

const RESSOURCES = ['gaz', 'electricity', 'water'];

const fields = {
  id: Table.number({}),
  user: Table.number({}),
  ressource: Table.enumerated({ values: RESSOURCES }),
  date: Table.string({ maxLength: 20 }),
  value: Table.number({}),
  createdAt: Table.dateTime({}),
};

const query = makeCreateTable('readings', fields);

console.log(query);
