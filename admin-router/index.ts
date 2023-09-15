import fs from 'node:fs';
import { polka, sirv } from '../libs';

import { apiFiles } from './api/files';
import { apiSql } from './api/sql';
import { apiTables } from './api/tables';

export const adminRouter = polka();

adminRouter.post('/api/files', apiFiles);
adminRouter.post('/api/sql', apiSql);
adminRouter.post('/api/tables', apiTables);

const whereAssetsCouldBe = [
  'node_modules/sqlite-95/admin-webapp/dist', // <- when using the lib
  'admin-webapp/dist', // <-- dev
];

whereAssetsCouldBe.every((path) => {
  if (fs.existsSync(path)) {
    adminRouter.use('/', sirv(path));
    return false;
  }
  return true;
});
