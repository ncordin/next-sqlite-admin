import { initDatabase } from '../drivers';
import { Players } from './players.table';

initDatabase({ file: 'base-tests.db' });

function main() {
  const player = Players.where('gold', '=', 100).findOne();
  console.log('#', player);

  const result = Players.insert({
    id: 1,
    name: 'Coco',
    gold: Players.rawSql('10 + 10'),
    isCool: true,
    state: 'data-A',
    createdAt: new Date(),
  });
  console.log('#', result);

  const count = Players.where('gold', '!=', null).count();
  console.log('#', count);

  const updateResult = Players.set('name', 'Coca')
    .set('gold', Players.rawSql('gold + 1'))
    .where('name', '!=', 'Coca')
    .update();
  console.log('#', updateResult);

  const players = Players.where('gold', '>', 2)
    .where('isCool', '=', true)
    .orderBy('gold', 'ASC')
    .orderBy('createdAt', 'DESC')
    .limit(100, 0)
    .findAll();
  console.log('#', players);

  const removeResult = Players.where('gold', '<', 10000).limit(20).remove();
  console.log('#', removeResult);
}

main();

/*
- unique insert
- auto create table
- in [...]
- selectAs: {averageValue: "AVG(value)"} {min: MIN()}
- group: [ fieldA, fieldB ]
- having: whereOptions
- select * from players where name != 'prout' or name is null
- https://stackoverflow.com/questions/10798808/sqlite-handling-of-null (replace != by IS NOT)
*/
