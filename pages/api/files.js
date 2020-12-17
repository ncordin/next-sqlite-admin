import fileSystem from "fs";

function getDirectories(path) {
  return fileSystem
    .readdirSync(path)
    .filter((name) => !name.startsWith("."))
    .filter((name) => {
      return fileSystem.statSync(`${path}/${name}`).isDirectory();
    });
}

function getFiles(path) {
  return fileSystem
    .readdirSync(path)
    .filter((name) => !name.startsWith("."))
    .filter((name) => {
      return !fileSystem.statSync(`${path}/${name}`).isDirectory();
    });
}

function isCleanPath(path) {
  return !path.includes("..");
}

export default (request, response) => {
  try {
    const askedPath = request.body.path || "";
    const cleanedPath = isCleanPath(askedPath) ? askedPath : "";
    // eslint-disable-next-line no-undef
    const path = cleanedPath || process.cwd();

    response.statusCode = 200;
    response.json({
      path,
      directories: getDirectories(path),
      files: getFiles(path),
    });
  } catch (error) {
    response.statusCode = 200;
    response.json({ error: error.message });
  }
};
