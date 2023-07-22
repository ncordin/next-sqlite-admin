import express from 'express';

import { apiFiles } from './api/files';
import { apiSql } from './api/sql';
import { apiTables } from './api/tables';

export const adminRouter = express.Router();

adminRouter.post('/api/files', apiFiles);
adminRouter.post('/api/sql', apiSql);
adminRouter.post('/api/tables', apiTables);

// If prod :
adminRouter.use(
  '/',
  express.static('node_modules/sqlite-95/admin-webapp/dist')
);
adminRouter.use('/', express.static('admin-webapp/dist'));

// If dev :
// return: This host only the api. UI is available on url ORIGIN_DEV.
