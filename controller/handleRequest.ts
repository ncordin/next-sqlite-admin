import { read } from './read';
import { Controller } from './types';

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
  index: string;
};

const BASE_PATH = '/' + Bun.main.split('/').slice(0, -1).join('/');

const CORS_HEADERS = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
  },
};

function join(...parts: string[]) {
  return parts
    .map((part) => part.replace(/^\.\//, ''))
    .map((part) => part.replace(/^\//, ''))
    .map((part) => part.replace(/\/$/, ''))
    .filter((a) => a)
    .join('/');
}

function useIndex(path: string, index: string) {
  return path === '' || path === '/' ? index : path;
}

export const handleRequest = async (request: Request, options: Options) => {
  const url = new URL(request.url); // href, protocol, host, hostname, port, search
  const requestPath = url.pathname;
  const query: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    query[key] = value;
  });

  if (request.method === 'OPTIONS') {
    console.log(`🔍 ${request.method} ${requestPath}`);
    return new Response('Departed', CORS_HEADERS);
  }

  if (requestPath.startsWith(options.api.prefix)) {
    const shortPath = requestPath.slice(options.api.prefix.length);
    const routePath = useIndex(shortPath, 'index');
    const routeFile = join(BASE_PATH, options.api.path, `${routePath}.ts`);

    const file = await Bun.file(routeFile);
    if ((await file.exists()) === false) {
      console.log(`🔴 No route matching: ${routeFile}`);
      return new Response(`404 :(`);
    }

    const controllerModule = await import(routeFile);
    const controller: Controller = controllerModule.default;

    const body = await request.json();
    const controllerRequest = {
      url: String(request.url),
      path: requestPath,
      body,
      query,
      method: request.method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
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

      console.log(`🟢 ${responseCode}`);

      return response;
    });
  }

  let matchingAsset: string | null = null;

  // Handle admin here.
  // router.use(adminUrl, adminRouter);

  options.assets.some((asset) => {
    if (requestPath.startsWith(asset.prefix)) {
      const shortPath = requestPath.slice(asset.prefix.length);
      const assetPath = useIndex(shortPath, 'index.html');
      const assetFile = join(BASE_PATH, asset.path, assetPath);
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
