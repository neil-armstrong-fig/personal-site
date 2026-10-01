import {spawnSync} from "node:child_process";
import {mkdir, readFile, stat} from "node:fs/promises";

import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import sharp from "sharp";

import {buildTripVideoArguments} from "@src/scripts/process-trip-videos/trip-videos/BuildTripVideoArguments";
import {hasLocationMetadata} from "@src/scripts/process-trip-videos/trip-videos/HasLocationMetadata";
import {parseTripVideos} from "@src/scripts/process-trip-videos/trip-videos/ParseTripVideos";
import {hasSensitiveMetadata} from "@src/scripts/shared/trip-photos/HasSensitiveMetadata";
import {repositoryRoot} from "@src/scripts/shared/repository/RepositoryRoot";

interface FfmpegOptions {
  allowFailure?: boolean;
}

const ROOT = process.cwd();
const POSTER_SECONDS = "1";

await processTripVideos(process.argv[2]);

async function processTripVideos(tripSlug: string | undefined): Promise<void> {
  if (tripSlug === undefined || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(tripSlug)) {
    throw new Error("Usage: pnpm trip:videos <trip-slug>");
  }

  const privateDirectory = `${repositoryRoot}/private-source/trips/${tripSlug}`;
  const publicDirectory = `${ROOT}/public/trips/${tripSlug}`;
  const videos = parseTripVideos(JSON.parse(await readFile(`${privateDirectory}/videos.json`, "utf8")));

  await mkdir(publicDirectory, {recursive: true});

  for (const video of videos) {
    const source = `${privateDirectory}/${video.source}`;
    const destination = `${publicDirectory}/${video.name}.mp4`;
    const poster = `${publicDirectory}/${video.name}.jpg`;

    runFfmpeg(buildTripVideoArguments({source, destination, muteAudio: video.muteAudio}));
    runFfmpeg([
      "-y",
      "-ss",
      POSTER_SECONDS,
      "-i",
      destination,
      "-frames:v",
      "1",
      "-q:v",
      "3",
      "-map_metadata",
      "-1",
      poster,
    ]);

    if (hasLocationMetadata(runFfmpeg(["-i", destination], {allowFailure: true}))) {
      throw new Error(`Location metadata remains in ${destination}.`);
    }

    if (hasSensitiveMetadata(await sharp(poster).metadata())) {
      throw new Error(`Sensitive metadata remains in ${poster}.`);
    }

    const {size} = await stat(destination);
    process.stdout.write(`${video.source} -> ${video.name}.mp4 (${(size / 1024 / 1024).toFixed(1)} MB) + poster\n`);
  }

  process.stdout.write(
    `Clips play locally in pnpm dev. Once the draft is approved, upload ${publicDirectory}/*.mp4 to the media bucket under trips/${tripSlug}/.\n`,
  );
}

function runFfmpeg(args: readonly string[], {allowFailure = false}: FfmpegOptions = {}): string {
  const result = spawnSync(ffmpegInstaller.path, ["-hide_banner", ...args], {encoding: "utf8"});

  if (result.status !== 0 && !allowFailure) {
    throw new Error(`ffmpeg failed: ${result.stderr}`);
  }

  return result.stderr;
}
