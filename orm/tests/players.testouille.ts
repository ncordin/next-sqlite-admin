import { initDatabase } from '../drivers';
import { Players } from './players.table';

initDatabase({ file: 'base-tests.db' });

function main() {
  const player = Players.where('gold', '=', 100).findOne();
  console.log('#', player);
  console.log('');

  const result = Players.insert({
    name: 'Coco',
    gold: Players.rawSql('10 + 10'),
    isCool: true,
    state: 'data-A',
    createdAt: new Date(),
  });
  console.log('#', result);
  console.log('');

  const count = Players.where('gold', '!=', null).count();
  console.log('#', count);
  console.log('');

  const updateResult = Players.set('name', 'Coca')
    .set('gold', Players.rawSql('gold + 1'))
    .where('name', '!=', 'Coca')
    .update();
  console.log('#', updateResult);
  console.log('');

  const players = Players.where('gold', '>', 2)
    .where('isCool', '=', true)
    .orderBy('gold', 'ASC')
    .orderBy('createdAt', 'DESC')
    .limit(100, 0)
    .findAll();
  console.log('#', players);
  console.log('');

  const removeResult = Players.where('gold', '<', 10000).limit(20).remove();
  console.log('#', removeResult);
  console.log('');

  const playerLike = Players.where('name', 'LIKE', `Co%`).findOne();
  console.log('#', playerLike);
  console.log('');
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
