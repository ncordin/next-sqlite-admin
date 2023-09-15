# SQLite 95 / ORM

SQLite ORM with a web admin.

# TODOS

- table logs / errors ?
- SQL: in(), group, having, unique insert.
- how to run tests ? npx ts-node src/test/[...]
- Table.lastQuery for debug.
- handle enum / bool / date in the admin form.
- make server start command runnable from any directory.
- use `rowid` during edition and in url.
- type utils to infer table type from field definition.
- write a complete Getting started guide https://khalilstemmler.com/blogs/typescript/node-starter-project/
- search in admin
- set a password to the admin interface
- hide Bun error 500 page on production

# Bugs

- Empty.

# Tips

- remove async await from controllers (break exception trace)

# How to publish new version

- bun run test
- npm version patch|minor|major
- npm publish

# How to run on production

- Create .env file `TEMPLATE`
- Use Bun >= 1.0.0 (not compatible with Node)
- pm2 start src/index.jsm
- Add Nginx proxy for HTTPS

- Or, if really needed, use args:
  PORT=3300 BASE_PATH=/sqlite-admin pm2 start --node-args "--es-module-specifier-resolution=node" server/index.js --name sqlite-admin

# Troubleshooting

`Cannot GET /admin/`, Can not access admin interface:

- Check for empty PREFIX, can cause bad URL like http://localhost//admin/
- The node command MUST be run from the server project directory
- Check node_module/sqlite-95/admin-webapp/dist exists
