import { adminRouter } from '.';
import { requestJsonBody } from '../controller/middlewares';
import { cors, polka } from '../libs';

const PORT = 8080;
const app = polka();

app.use(cors());
app.use(requestJsonBody());

app.use('/', adminRouter);

app.listen(PORT, () => {
  console.log('');
  console.log(`SQLite 95 ready! ✨`);
  console.log('');
  console.log(`http://localhost:${PORT}`);
  console.log('');
});
