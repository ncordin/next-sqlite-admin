import { polka } from '../libs';
import { cors } from '../libs';
import { adminRouter } from '.';
import { HTTPRequest, HTTPResponse } from '../controller/types';

const PORT = 8080;
const app = polka();

const jsonMiddleware = (
  request: HTTPRequest,
  response: HTTPResponse,
  next: () => void
) => {
  response.json = (payload) => {
    response.setHeader('Content-Type', 'application/json');
    const jsonResponse = JSON.stringify(payload);
    response.end(jsonResponse);
  };
  next();
};

const bodyMiddleware = (
  request: HTTPRequest<string | {}>,
  response: HTTPResponse,
  next: () => void
) => {
  if (request.method === 'POST') {
    const body: Uint8Array[] = [];
    request
      .on('data', (chunk) => {
        // TODO: limit the size to avoid problems.
        body.push(chunk);
      })
      .on('end', () => {
        const fullBody = Buffer.concat(body).toString();

        if (request.headers['content-type'] === 'application/json') {
          if (fullBody.trim()) {
            try {
              const json = JSON.parse(fullBody);
              request.body = json;
            } catch (e) {
              response.statusCode = 400;
              response.end('Invalid JSON');
            }
          } else {
            request.body = {};
          }
        } else {
          request.body = fullBody;
        }

        next();
      })
      .on('error', (error) => {
        console.error(error);
        response.statusCode = 400;
        response.end();
      });
  } else {
    next();
  }
};

app.use(cors());
app.use(jsonMiddleware);
app.use(bodyMiddleware);
app.use('/', adminRouter);

app.listen(PORT, () => {
  console.log('');
  console.log(`SQLite 95 ready! ✨`);
  console.log('');
  console.log(`http://localhost:${PORT}`);
  console.log('');
});
