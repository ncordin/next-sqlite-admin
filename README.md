# SQLite 95 / ORM

SQLite ORM with a web admin.

# TODOS

- table logs / errors ?
- SQL: in(), group, having, unique insert.
- show version on initDatabase?
- how to run tests ? npx ts-node src/test/[...]
- Table.lastQuery for debug.
- handle enum / bool / date in the admin form.
- make server start command runnable from any directory.
- use `rowid` during edition and in url.
- type utils to infer table type from field definition.
- write a complete Getting started guide https://khalilstemmler.com/blogs/typescript/node-starter-project/
- search in admin

# Bugs

- Empty.

# Tips

- remove async await from controllers (break exception trace)

# How to publish new version

- npm run test
- npm version patch|minor|major
- npm publish

# How to run and production

- Create .env file `TEMPLATE`
- Use Node LTS >= 16 with better-sqlite3 support.
- Use .jsm files for good handling of javascript ES modules in Node (or Typescript).
- pm2 start src/index.jsm
- Add Nginx proxy for HTTPS

- Or, if really needed, use args:
  PORT=3300 BASE_PATH=/sqlite-admin pm2 start --node-args "--es-module-specifier-resolution=node" server/index.js --name sqlite-admin

# Troubleshooting

`Cannot GET /admin/`, Can not access admin interface:

- Check for empty PREFIX, can cause bad URL like http://localhost//admin/
- The node command MUST be run from the server project directory
- Check node_module/sqlite-95/admin-webapp/dist exists
