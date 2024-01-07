import { dirname, join } from 'node:path';
import { cwd } from 'node:process';
import { callController } from './callController';
import { Options } from './types';
import { CORS_HEADERS } from './cors';
import { make404, serveStaticFile, joinPrefix, useIndex } from './utils';

const ENTRY_PATH = dirname(Bun.main);
const ROOT_PATH = cwd();
const IS_ADMIN = Bun.main.includes('admin-router/start.ts');
const LIB_PATH = IS_ADMIN
  ? ROOT_PATH
  : join(ROOT_PATH, '/node_modules/sqlite-95');

export const handleRequest = async (request: Request, options: Options) => {
  const makePrefix = (subPrefix: string | undefined) =>
    joinPrefix(options.prefix || '', subPrefix || '');

  const API_PREFIX = makePrefix(options.api?.prefix);
  const ADMIN_PREFIX = makePrefix(options.admin?.prefix);
  const requestPath = new URL(request.url).pathname; // href, protocol, host, hostname, port, search

  // Est-ce que ca ne concerne pas QUE l'api?
  // Est-ce qu'on veut traiter TOUTES les requêtes meme si elles matchent rien ?
  if (request.method === 'OPTIONS') {
    console.log(`🔍 OPTIONS ${requestPath}`);
    return new Response('Departed', CORS_HEADERS);
  }

  // Handle API:
  if (options.api && requestPath.startsWith(API_PREFIX)) {
    const shortPath = requestPath.slice(API_PREFIX.length);
    const routePath = useIndex(shortPath, 'index');
    const routeFile = join(ENTRY_PATH, options.api.path, `${routePath}.ts`); // TODO: utils to build route with unit tests.

    return callController(routeFile, request);
  }

  // Handle admin:
  if (requestPath.startsWith(ADMIN_PREFIX)) {
    const shortPath = requestPath.slice(ADMIN_PREFIX.length);

    if (shortPath.startsWith('api/')) {
      const routeFile = join(LIB_PATH, '/admin-router', `${shortPath}.ts`);
      return callController(routeFile, request);
    }

    const assetPath = useIndex(shortPath, 'index.html');
    const assetFile = join(LIB_PATH, '/admin-webapp/public', assetPath);
    return serveStaticFile(assetFile, 'admin asset');
  }

  // Handle assets:
  const matchingAsset = (options.assets ?? []).find((asset) => {
    // TODO: be aware of matching priority.
    const assetPrefix = makePrefix(asset.prefix);

    return request.method === 'GET' && requestPath.startsWith(assetPrefix);
  });

  if (matchingAsset) {
    const assetPrefix = makePrefix(matchingAsset.prefix);
    const shortPath = requestPath.slice(assetPrefix.length);
    const assetPath = useIndex(shortPath, 'index.html');
    const assetFile = join(ENTRY_PATH, matchingAsset.path, assetPath);
    return serveStaticFile(assetFile, `asset [prefix='${assetPrefix}']`);
  }

  return make404('final', requestPath);
};
