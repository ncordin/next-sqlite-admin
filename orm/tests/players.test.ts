import { initDatabase } from '../drivers';
import { Players } from './players.table';

initDatabase({ file: 'base-tests.db' });

const main = async () => {
  await Players.where('gold', '=', 100)
    .findOne()
    .then((player) => {
      console.log({ player });
    });

  await Players.insert({
    id: 1,
    name: 'Coco',
    gold: 5,
    isCool: true,
    state: 'data-A',
    createdAt: new Date(),
  }).then((result) => {
    console.log(result);
  });

  await Players.where('gold', '!=', null)
    .count()
    .then((count) => {
      console.log({ count });
    });

  await Players.set('name', 'Coca')
    .where('name', '!=', 'Coca')
    .update()
    .then((result) => {
      console.log(result);
    });

  await Players.where('gold', '>', 2)
    .where('isCool', '=', true)
    .findAll()
    .then((players) => {
      console.log({ players });
    });

  await Players.where('gold', '<', 10000)
    .remove()
    .then((result) => {
      console.log(result);
    });
};

main();

/*
- auto create table

- createdAt: Readings.sql('now()'),
- set: { value: Readings.sql('value - 10') },
- selectAs: {averageValue: "AVG(value)"}
- in [...]
- group: [ fieldA, fieldB ]
- having: whereOptions
- sortBy: { fieldA: "desc" },
- limit: { offset: 10, limit: 10 },
- SQL: in(), group, having, sort, unique insert, count, has, limit.
*/
