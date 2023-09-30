import { Table } from '../';
import { InferFromFields } from '../..';

const fields = {
  id: Table.number({ canBeNull: false, default: 42 }),
  name: Table.string({
    maxLength: 12,
    canBeNull: true,
    default: 'coucou',
  }),
  gold: Table.number({ canBeNull: true, default: null }),
  isCool: Table.boolean({ canBeNull: true, default: true }),
  state: Table.enumerated({ values: ['data-A', 'data-B'], default: null }),
  createdAt: Table.dateTime({ canBeNull: true, default: new Date() }),
};

type Player = InferFromFields<typeof fields>;

export const Players = Table.make<Player>({ name: 'players', fields });
