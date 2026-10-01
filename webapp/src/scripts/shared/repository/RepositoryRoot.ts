import path from "node:path";

// Scripts run with the webapp package as the working directory (pnpm sets it for every package script). The
// repository root, which holds the ignored `private-source/` and `.env`, is its parent.
export const repositoryRoot = path.resolve(process.cwd(), "..");
