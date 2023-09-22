import { adminRouter } from '.';
import {
  requestQuery,
  requestBody,
  jsonResponse,
} from '../controller/middlewares';
import { cors, polka } from '../libs';

const PORT = 8080;
const app = polka();

app.use(cors());
app.use(requestQuery());
app.use(requestBody());
app.use(jsonResponse());

app.use('/', adminRouter);

app.listen(PORT, () => {
  console.log('');
  console.log(`SQLite 95 ready! ✨`);
  console.log('');
  console.log(`http://localhost:${PORT}`);
  console.log('');
});
