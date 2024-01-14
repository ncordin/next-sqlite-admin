import { Table } from '../';
import { InferFromFields } from '../..';

const fields = {
  id: Table.number({ primaryKey: true, autoIncrement: true }),
  name: Table.string({ maxLength: 12, default: 'coucou' }),
  gold: Table.number({ canBeNull: true, default: null }),
  isCool: Table.boolean({ canBeNull: true, default: true }),
  state: Table.enumerated({ values: ['data-A', 'data-B'], default: null }),
  createdAt: Table.dateTime({ default: new Date() }),
};

type Player = InferFromFields<typeof fields>;

export const Players = Table.make<Player>({ name: 'players', fields });
