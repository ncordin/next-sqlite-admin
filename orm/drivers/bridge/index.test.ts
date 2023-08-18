/**
 * npx ts-node orm/drivers/bridge/index.test.ts
 */
import { close, initialize, queryRead, queryWrite } from './index';

initialize('test.db');

const result = queryWrite(
  `CREATE TABLE IF NOT EXISTS player (id int, name char, gold int);`
);

result.then((output) => {
  console.log({ output });

  const result2 = queryWrite(`INSERT INTO player VALUES (1, 'name-of-1', 10);`);

  result2.then((output) => {
    console.log({ output });

    const result3 = queryRead('SELECT * FROM `player` LIMIT 4;');

    result3.then((output) => {
      console.log(output);

      close();
    });
  });
});
