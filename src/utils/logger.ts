const injectParameters = (sql: string, parameters: string[]) => {
  const sqlSplit = sql.split('?');
  let sqlCool = sqlSplit[0];

  parameters.forEach((parameter, index) => {
    sqlCool += `'${parameter}'` + sqlSplit[index + 1];
  });

  return sqlCool;
};

export const logQuery = (sql: string, parameters: string[]) => {
  console.log(`\n⚡ ${injectParameters(sql, parameters)} \n\n`);
};
