## TODO

Write the README

PORT=3300 BASE_PATH=/sqlite-admin pm2 start --node-args "--es-module-specifier-resolution=node" server/index.js --name sqlite-admin

# flat-screen

A set of Node utilities for building APIs.

# TODOS

- répertoire logs/ avec fichiers : sql.logs / controllers.log / others.log
- comment se comporte un controller quand une sql failed ?
- un wrapper pour lancer des commandes ? (comme scripts/ dans ECP)
- ou sinon, une table errors

# Troubleshooting

`gyp: No Xcode or CLT version detected!`

> xcode-select --install
