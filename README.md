# SQLite 95 / ORM

A set of Node utilities for building APIs.

# TODOS

- table logs / errors ?
- SQL: in(), group, having, sort, unique insert, count, has, limit.
- Show version on initDatabase?
- where: {url : undefined} <-- crash in formater.
- how to run tests ? npx ts-node src/test/[...]
- need in comparators `!=` ?
- Table.lastQuery for debug.
- auto create table dont not write types.
- handle enum / bool / date in the admin form.
- make server start command runnable from any directory
- use `rowid` during edition and in url
- drop bigint support

# Tips

- remove async await from controllers (break exception trace)

# How to publish new version

- Run tests
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

Can not access admin interface:

- Check for empty PREFIX, can cause bad URL like http://localhost//admin/
- The node command MUST be run from the server project directory

`gyp: No Xcode or CLT version detected!`

> xcode-select --install
