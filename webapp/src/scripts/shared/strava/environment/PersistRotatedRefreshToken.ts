import {readFile, writeFile} from "node:fs/promises";
import {repositoryRoot} from "@src/scripts/shared/repository/RepositoryRoot";

const ENV_PATH = `${repositoryRoot}/.env`;

export async function persistRotatedRefreshToken(refreshToken: string): Promise<void> {
  if (refreshToken === process.env.STRAVA_REFRESH_TOKEN) {
    return;
  }

  const env = await readFile(ENV_PATH, "utf8");
  await writeFile(
    ENV_PATH,
    env.replace(/^STRAVA_REFRESH_TOKEN=.*$/m, () => `STRAVA_REFRESH_TOKEN=${refreshToken}`),
  );
  process.stdout.write("Strava issued a new refresh token; .env has been updated.\n");
}
