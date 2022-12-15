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
    gold: Players.rawSql('10 + 10'),
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
    .set('gold', Players.rawSql('gold + 1'))
    .where('name', '!=', 'Coca')
    .update()
    .then((result) => {
      console.log(result);
    });

  await Players.where('gold', '>', 2)
    .where('isCool', '=', true)
    .orderBy('gold', 'ASC')
    .orderBy('createdAt', 'DESC')
    .limit(100, 0)
    .findAll()
    .then((players) => {
      console.log({ players });
    });

  await Players.where('gold', '<', 10000)
    .limit(20)
    .remove()
    .then((result) => {
      console.log(result);
    });
};

main();

/*
- unique insert
- auto create table
- in [...]
- selectAs: {averageValue: "AVG(value)"} {min: MIN()}
- group: [ fieldA, fieldB ]
- having: whereOptions
*/
