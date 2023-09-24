import fs from 'node:fs';
import { polka, sirv } from '../libs';

import { wrapController } from '..';
import { apiFiles } from './api/files';
import { apiSql } from './api/sql';
import { apiTables } from './api/tables';

export const adminRouter = polka();

adminRouter.post('/api/files', wrapController(apiFiles));
adminRouter.post('/api/sql', wrapController(apiSql));
adminRouter.post('/api/tables', wrapController(apiTables));

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
