## TODO

Write the README

PORT=3300 BASE_PATH=/sqlite-admin pm2 start --node-args "--es-module-specifier-resolution=node" server/index.js --name sqlite-admin

# SQLite 95 / ORM

A set of Node utilities for building APIs.

# TODOS

- table errors ?
- SQL: in(), group, having, sort, unique insert, count, has, limit.
- Show version on initDatabase?
- where: {url : undefined} <-- crash in formater.
- how to run tests ? npx ts-node src/test/[...]
- need in comparators `!=` ?
- Table.lastQuery for debug.

# Tips

- remove async await from controllers (break exception trace)

# Troubleshooting

- If not typescript: use .mjs files and .env so it's cool with pm2 (0 args).
- Node 16 support modules ans LTS of better-sqlite3.

Can not access admin interface:

- Check for empty PREFIX, can cause bad URL like http://localhost//admin/

`gyp: No Xcode or CLT version detected!`

> xcode-select --install
