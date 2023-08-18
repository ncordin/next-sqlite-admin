import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

type LinesOfTuples = Array<Array<string>>;
type Resolver = (result: number | LinesOfTuples) => void;

let process: ChildProcessWithoutNullStreams | null = null;
let currentResolve: Resolver | null = null;
let currentQuery: string | null = null;
let currentMode: 'read' | 'write' | null;

function formateResult(rawData: string) {
  if (currentMode === 'write') {
    return parseInt(rawData);
  }

  if (currentMode === 'read') {
    return rawData
      .split('\n')
      .slice(0, -1)
      .map((line) => line.split('|'));
  }

  throw new Error('invalid currentMode');
}

function handleOutput(stream: any) {
  // console.log('stdout: ', stream.toString());

  if (currentResolve) {
    const result = formateResult(stream.toString());
    currentResolve(result);
  }

  currentResolve = null;
  currentQuery = null;
  currentMode = null;
}

function handleError(stream: any) {
  console.log('stderr: ', stream.toString());
  throw new Error('Data detected stderr.');
}

function handleExit(exitCode: number) {
  if (exitCode === 0) {
    console.log('Database closed.');
  } else {
    console.log('Woop!');
  }
}

function initialize(file: string) {
  process = spawn('sqlite3', [file]);
  process.stdout.on('data', handleOutput);
  process.stderr.on('data', handleError);
  process.on('exit', handleExit);
}

function execQuery(command: string) {
  if (!process) {
    throw new Error('Process not ready.');
  }

  if (currentResolve) {
    throw new Error(
      'Error: database locked. Queries must be awaited.' + currentQuery
    );
  }

  currentQuery = command;

  const promise = new Promise((resolve) => {
    currentResolve = resolve;
  });

  process.stdin.write(`${command};\n`);

  return promise;
}

const queryWrite = (sql: string) => {
  currentMode = 'write';

  return execQuery(`${sql};\n SELECT changes();`);
};

const queryRead = (sql: string) => {
  currentMode = 'read';

  return execQuery(`${sql};`);
};

const close = () => {
  if (!process) {
    throw new Error('Process not ready.');
  }

  process.stdin.write(`.quit\n`);
  process.stdin.end();
};

export { initialize, queryWrite, queryRead, close };
