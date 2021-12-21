import { Table } from '../base';
import { makeCreateTable } from '../base/queryBuilder';

const RESSOURCES = ['gaz', 'electricity', 'water'];

const fields = {
  id: Table.bigInt({}),
  user: Table.bigInt({}),
  ressource: Table.enumerated({ values: RESSOURCES }),
  date: Table.string({ maxLength: 20 }),
  value: Table.number({}),
  createdAt: Table.dateTime({}),
};

const query = makeCreateTable('readings', fields);

console.log(query);

// TODO tester TOUTES les possibilites.
