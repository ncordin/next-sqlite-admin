import { dirname, join } from 'node:path';
import { cwd } from 'node:process';
import { callController } from './callController';
import { HandleRequestOptions } from './types';
import { CORS_HEADERS } from './cors';
import { make404, serveStaticFile, joinPrefix, useIndex } from './utils';

const ENTRY_PATH = dirname(Bun.main);
const ROOT_PATH = cwd();
const IS_ADMIN = Bun.main.includes('admin-router/start.ts');
const LIB_PATH = IS_ADMIN
  ? ROOT_PATH
  : join(ROOT_PATH, '/node_modules/sqlite-95');

export const getUrlsFromOptions = (options: HandleRequestOptions) => {
  const makePrefix = (subPrefix: string | undefined) =>
    joinPrefix(options.prefix || '', subPrefix || '');

  const app = makePrefix('');
  const admin = makePrefix(options.admin?.prefix);

  return { app, admin };
};

export const handleRequest = async (
  request: Request,
  options: HandleRequestOptions
) => {
  const makePrefix = (subPrefix: string | undefined) =>
    joinPrefix(options.prefix || '', subPrefix || '');

  const ADMIN_PREFIX = makePrefix(options.admin?.prefix);
  const ASSETS_PREFIX = makePrefix(options.assets?.prefix);
  const APP_PREFIX = makePrefix('');
  const requestPath = new URL(request.url).pathname; // href, protocol, host, hostname, port, search

  // Est-ce que ca ne concerne pas QUE l'api?
  // Est-ce qu'on veut traiter TOUTES les requêtes meme si elles matchent rien ?
  if (request.method === 'OPTIONS') {
    console.log(`🔍 OPTIONS ${requestPath}`);
    return new Response('Departed', CORS_HEADERS);
  }

  // Handle admin:
  if (options.admin && requestPath.startsWith(ADMIN_PREFIX)) {
    const shortPath = requestPath.slice(ADMIN_PREFIX.length);

    if (shortPath.startsWith('api/')) {
      if (
        options.admin.password &&
        options.admin.password === request.headers.get('password')
      ) {
        // TODO: the admin logic could be a middleware!
        const routeFile = join(LIB_PATH, '/admin-router', `${shortPath}.ts`);
        return callController(routeFile, request, undefined);
      } else {
        return new Response(
          JSON.stringify({
            error: {
              title: 'Invalid password',
              message:
                'Password is declared in server configuration and can not be empty.',
            },
          }),
          { status: 403 }
        );
      }
    }

    const assetPath = useIndex(shortPath, 'index.html');
    const assetFile = join(LIB_PATH, '/admin-webapp/public', assetPath);
    return serveStaticFile(assetFile, 'admin asset');
  }

  // Handle assets:
  if (
    options.assets &&
    requestPath.startsWith(ASSETS_PREFIX) &&
    request.method === 'GET'
  ) {
    const shortPath = requestPath.slice(ASSETS_PREFIX.length);
    const assetPath = useIndex(shortPath, 'index.html');
    const assetFile = join(ENTRY_PATH, options.assets.path, assetPath);

    return serveStaticFile(assetFile, `asset`);
  }

  // Handle API:
  if (options.controllers && requestPath.startsWith(APP_PREFIX)) {
    const shortPath = requestPath.slice(APP_PREFIX.length);
    const controllerPath = useIndex(shortPath, 'index');
    const controllerFile = join(
      ENTRY_PATH,
      options.controllers.path,
      `${controllerPath}.ts`
    );

    if (await Bun.file(controllerFile).exists()) {
      return callController(
        controllerFile,
        request,
        options.controllers.middleware
      );
    }
  }

  // CatchAll:
  if (options.catchAll && options.catchAll.type === 'controller') {
    const controllerFile = join(ENTRY_PATH, options.catchAll.path);

    return callController(
      controllerFile,
      request,
      options.controllers?.middleware
    );
  }

  if (options.catchAll && options.catchAll.type === 'static') {
    const assetFile = join(ENTRY_PATH, options.catchAll.path);

    return serveStaticFile(assetFile, `catch-all static`);
  }

  return make404('final', requestPath);
};
