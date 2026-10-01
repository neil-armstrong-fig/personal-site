import {spawnSync} from "node:child_process";

const separatorIndex = process.argv.indexOf("--");

if (separatorIndex < 0) {
  throw new Error("The scoped command must include a '--' separator.");
}

const command = process.argv[2];
const commandArguments = process.argv.slice(3, separatorIndex);
const targets = process.argv.slice(separatorIndex + 1);

if (command === undefined || targets.length === 0) {
  throw new Error("Pass at least one explicit file or directory after '--'.");
}

const result = spawnSync(command, [...commandArguments, ...targets], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (result.error !== undefined) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
