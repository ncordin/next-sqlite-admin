# SQLite 95 / ORM

SQLite ORM with a web admin.

# TODOS

- table logs / errors ?
- SQL: in(), group, having.
- Table.lastQuery for debug.
- handle enum / bool / date in the admin form.
- make server start command runnable from any directory.
- use `rowid` during edition and in url.
- write a complete Getting started guide https://khalilstemmler.com/blogs/typescript/node-starter-project/
- search in admin
- set a password to the admin interface
- set port / suffix / database name from the admin (editor of .env)
- start the front server from the admin (with dev mode)
- hide Bun error 500 page on production
- add more Response types: redirection, image, etc...
- add cookies to request, and setCookie to response
- /admin should redirect to /admin/ automatically

* dynamique controllers routing

# Bugs

- encode crash if value is wrong (eg: null instead of null)

# How to publish new version

- bun test
- cd admin-webapp && bun install && bun run build
- cd root of project
- npm version patch|minor|major
- npm publish --dry-run
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
- Check node_module/sqlite-95/admin-webapp/public exists

# Gros bordel a ranger

Theme 95 c cool
Admin qui supporte enum et bool
Voir ca comme un pack ORM / Admin
Briser l'analysis paralysis

Doit fonctionner offline (local network, no cloud)
Doit fonctionner sur un VPS à 3$ 512 Mo de RAM
Il faut un ORM élégant est auto cast (bool, number, enum, date)
SQL c'est old school, mais maîtrisé c'est OP
Entry point en Express/Bun = OP (tout est possible)

Drop support des Bigint
Ecrire une doc ! Genre les dates UTC et les commandes serveurs
L'admin doit gérer le contrôle des enum et bool via Constraint
Trouver quoi faire du desktop : voir les logs des endpoints / visiteur / serveur web / var d'env

Supabase : 30 min d'install et 50 img dockers installées
Prisma / Hasura : install qui need 2GB de RAM
Cloud avec lamba functions c'est à chier
Pocket base ? UI cool, best potentiel. Pas de logique custom :/ (voir tuto Youtube fireship)
