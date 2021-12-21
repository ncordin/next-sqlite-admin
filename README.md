## TODO

Write the README

PORT=3300 BASE_PATH=/sqlite-admin pm2 start --node-args "--es-module-specifier-resolution=node" server/index.js --name sqlite-admin

# SQLite 95 / ORM

A set of Node utilities for building APIs.

# TODOS

- table errors ?
- SQL: in(), group, having, sort, unique insert, count, has, limit.

# Tips

- remove async await from controllers (break exception trace)

# Troubleshooting

`gyp: No Xcode or CLT version detected!`

> xcode-select --install
