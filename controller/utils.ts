export function useIndex(path: string, index: string) {
  return path === '' || path.slice(-1) === '/' ? `${path}${index}` : path;
}

export function make404(description: string, path: string) {
  console.log(`🔴 404 (${description}): ${path}`);
  return new Response(`404 (${description})`, { status: 404 });
}

export async function serveStaticFile(pathToFile: string, description: string) {
  const file = Bun.file(pathToFile);

  if ((await file.exists()) === false) {
    return make404(description, pathToFile);
  }

  console.log(`📄 ${description} ${pathToFile}`);
  return new Response(file);
}
