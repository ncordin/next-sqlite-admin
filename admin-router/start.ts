import { handleRequest } from '..';

const port = 8080;
const prefix = '';

const SERVER_OPTIONS = {
  admin: {
    prefix,
    password: '',
  },
};

const server = Bun.serve({
  port,
  async fetch(request) {
    return handleRequest(request, SERVER_OPTIONS);
  },
});

console.log('');
console.log(`SQLite 95 ready! ✨`);
console.log('');
console.log(`http://${server.hostname}:${port}${prefix}`);
console.log('');
