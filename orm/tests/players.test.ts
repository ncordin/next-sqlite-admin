import { initDatabase, Table } from '../';

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

type Player = {
  id: number;
  name: string;
  gold: number;
  isCool: boolean;
  state: 'data-A' | 'data-B';
  createdAt: Date;
};

export const Players = Table.make<Player>({ name: 'players', fields });

initDatabase({ file: 'base-tests.db' });

Players.findAll({ where: { id: 1, gold: { '<': 40 }, name: null } }).then(
  (players) => {
    console.log(players);
  }
);

Players.insert({
  id: 1,
  name: 'Nico',
  gold: 5,
  isCool: true,
  state: 'data-A',
  createdAt: new Date(),
});
