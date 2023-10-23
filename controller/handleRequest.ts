import { cwd } from 'node:process';
import { read } from './read';
import { Controller, Method } from './types';
import { join, dirname } from 'node:path';

const ROOT_PATH = cwd();
const ENTRY_PATH = dirname(Bun.main);

const CORS_HEADERS = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
  },
};

type Options = {
  admin: {
    prefix: string;
    password: string;
  };
  api: {
    prefix: string;
    path: string;
    cors: string;
  };
  assets: {
    prefix: string;
    path: string;
  }[];
};

function useIndex(path: string, index: string) {
  return path === '' || path === '/' ? index : path;
}

async function callController(filePath: string, request: Request) {
  const file = await Bun.file(filePath);

  if ((await file.exists()) === false) {
    console.log(`🔴 No route matching: ${filePath}`);
    return new Response(`404 :(`);
  }

  const controllerModule = await import(filePath);

  if (typeof controllerModule.default !== 'function') {
    return new Response('Controller function must be default export.', {
      status: 500,
    });
  }

  const controller: Controller = controllerModule.default;
  // TODO: check if method matches.

  const url = new URL(request.url); // href, protocol, host, hostname, port, search
  const requestPath = url.pathname;
  const query: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    query[key] = value;
  });
  const bodyText = await request.text();
  const body = bodyText ? JSON.parse(bodyText) : {};
  console.log({ body });

  const controllerRequest = {
    url: String(request.url),
    path: requestPath,
    body,
    query,
    method: request.method as Method,
    headers: request.headers.toJSON(),
    read: (
      from: 'query' | 'body',
      name: string,
      type: 'string' | 'number' | 'boolean',
      defaultValue: unknown
    ) => {
      const value = ((from === 'query' ? query : body) || {})[name];

      if (type === 'boolean') {
        return read(value, 'boolean', defaultValue);
      }
      if (type === 'number') {
        return read(value, 'number', defaultValue);
      }
      if (type === 'string') {
        return read(value, 'string', defaultValue);
      }
    },
  };

  let responseCode = 200;

  const controllerResponse = {
    setStatusCode: (code: number) => {
      responseCode = code;
    },
  };

  console.log(`🎯 ${request.method} ${requestPath}`);

  return Promise.resolve(
    controller(controllerRequest, controllerResponse)
  ).then((value) => {
    const response = new Response(JSON.stringify(value), {
      status: responseCode,
      headers: CORS_HEADERS.headers,
    });

    console.log(`  🟢 ${responseCode}`);

    return response;
  });
}

export const handleRequest = async (request: Request, options: Options) => {
  const url = new URL(request.url); // href, protocol, host, hostname, port, search
  const requestPath = url.pathname;

  // Est-ce que ca ne concerne pas QUE l'api?
  // Est-ce qu'on veut traiter TOUTES les requêtes meme si elles matchent rien ?
  if (request.method === 'OPTIONS') {
    console.log(`🔍 ${request.method} ${requestPath}`);
    return new Response('Departed', CORS_HEADERS);
  }

  // Handle API:
  if (requestPath.startsWith(options.api.prefix)) {
    const shortPath = requestPath.slice(options.api.prefix.length);
    const routePath = useIndex(shortPath, 'index');
    const routeFile = join(ENTRY_PATH, options.api.path, `${routePath}.ts`); // TODO: utils to build route with unit tests.

    return callController(routeFile, request);
  }

  let matchingAsset: string | null = null;

  // Handle admin:
  if (requestPath.startsWith(options.admin.prefix)) {
    const shortPath = requestPath.slice(options.admin.prefix.length);

    if (shortPath.startsWith('/api/')) {
      const routeFile = join(
        ROOT_PATH,
        '/node_modules/sqlite-95/admin-router',
        `${shortPath}.ts`
      );
      console.log({ routeFile });
      return callController(routeFile, request);
    }

    const assetPath = useIndex(shortPath, 'index.html');
    const assetFile = join(
      ROOT_PATH,
      '/node_modules/sqlite-95/admin-webapp/dist',
      assetPath
    );
    const file = Bun.file(assetFile);
    // Error 500 if file does not exists. Maybe `404 missing admin assets` is better?
    return new Response(file);
  }

  // Handle assets:
  options.assets.some((asset) => {
    // TODO: makes slash matches easy.
    // TODO: be aware of matching priority.
    if (requestPath.startsWith(asset.prefix)) {
      const shortPath = requestPath.slice(asset.prefix.length);
      const assetPath = useIndex(shortPath, 'index.html');
      const assetFile = join(ENTRY_PATH, asset.path, assetPath);
      matchingAsset = assetFile;

      return true;
    }
  });

  if (matchingAsset) {
    console.log(`📄 ${request.method} ${requestPath}`);
    const file = Bun.file(matchingAsset);
    return new Response(file);
  }

  return null;
};
