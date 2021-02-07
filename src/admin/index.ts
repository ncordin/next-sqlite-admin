import express from 'express';

import { apiFields } from './api/fields';
import { apiSql } from './api/sql';
import { apiTables } from './api/tables';

export const adminRouter = express.Router();

adminRouter.post('/api/fields', apiFields);
adminRouter.post('/api/sql', apiSql);
adminRouter.post('/api/tables', apiTables);

// If prod :
adminRouter.use('/', express.static('node_modules/flat-screen/webapp/dist'));

// If dev :
// return: This host only the api. UI is available on url ORIGIN_DEV.
