import fileSystem from "fs";

export function getFiles() {
  return {
    // eslint-disable-next-line no-undef
    path: __dirname,
    files: fileSystem.readdirSync("/"),
  };
}
