# AGENTS.md — scripts

Command-line tools behind the `pnpm` scripts (Strava sync, trip photos and videos, build validation, IndexNow).

Command-line scripts are TypeScript under `webapp/src/scripts/<script-name>/`, one folder per script (`sync-strava/`,
`process-trip-photos/`), each with its `<ScriptName>.ts` entry point and the helpers and tests only it uses in
subject folders beneath it. Code two scripts share lives in `webapp/src/scripts/shared/<subject>/`; code that pages also
read stays in `webapp/src/content/`. Node 24 strips the types itself, so there is no ts-node or tsx: run a script with
`node --import ./src/scripts/register-src-alias/RegisterSrcAlias.ts <script>.ts`, which resolves `@src/*` and
extensionless imports, and give any new script the same flag. Scripts import source with `@src/*`, never `../`.
Scripts run with `webapp/` as the working directory (every entry point is a `pnpm` script), so build paths from
`process.cwd()`, and reach `private-source/` and `.env` at the repository root through `repositoryRoot`, never a file-relative `new URL("../", ...)`: a moved file does not rewrite it. Type stripping cannot compile enums, namespaces or
parameter properties, so do not use them.

- Dependencies are one-way: scripts may depend on content, site and shared components; nothing else may depend on scripts.
- Never print credentials from `.env`; Strava access is `activity:read` only.
