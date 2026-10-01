import {access, mkdir, readFile, writeFile} from "node:fs/promises";

import sharp from "sharp";

import {selectTripActivities} from "@src/scripts/shared/strava/activity-selection/TripActivities";
import {selectTripBonusRides} from "@src/scripts/shared/strava/activity-selection/TripBonusRides";
import {selectTripOutings} from "@src/scripts/shared/strava/activity-selection/TripOutings";
import {persistRotatedRefreshToken} from "@src/scripts/shared/strava/environment/PersistRotatedRefreshToken";
import {stravaCredentialsFromEnvironment} from "@src/scripts/shared/strava/environment/StravaCredentialsFromEnvironment";
import {refreshStravaAccess} from "@src/scripts/shared/strava/strava-access/StravaAccess";
import {tripSources} from "@src/scripts/shared/strava/trip-sources/TripSources";
import type {StravaActivitySummary} from "@src/scripts/shared/strava/types/StravaActivitySummary";
import {hasSensitiveMetadata} from "@src/scripts/shared/trip-photos/HasSensitiveMetadata";
import {repositoryRoot} from "@src/scripts/shared/repository/RepositoryRoot";

interface StravaPhoto {
  unique_id?: string;
  primary?: boolean;
  default_photo?: boolean;
  urls?: Record<string, unknown>;
}

interface RideMediaPhoto {
  file: string;
  alt: string;
}

interface RideMediaManifest {
  photos: Record<string, RideMediaPhoto>;
}

interface ActivityPhotoSync {
  requestedPhotoList: boolean;
  photo?: RideMediaPhoto;
}

const ROOT = process.cwd();
const PRIVATE_PHOTO_ROOT = `${repositoryRoot}/private-source/strava/photos`;
const apiBase = "https://www.strava.com";

await syncStravaMedia();

async function syncStravaMedia(): Promise<void> {
  const activities = JSON.parse(
    await readFile(`${repositoryRoot}/private-source/strava/activities.json`, "utf8"),
  ) as StravaActivitySummary[];
  const {accessToken, refreshToken} = await refreshStravaAccess(stravaCredentialsFromEnvironment());
  await persistRotatedRefreshToken(refreshToken);

  let requestCount = 0;
  let successfulPhotoRequests = 0;
  let failedPhotoRequests = 0;

  for (const source of tripSources) {
    const tripDirectory = `${ROOT}/src/content/trip/entries/${source.slug}`;
    const manifestPath = `${tripDirectory}/ride-media.json`;
    let existingManifest: RideMediaManifest = {photos: {}};

    if (await exists(manifestPath)) {
      existingManifest = JSON.parse(await readFile(manifestPath, "utf8")) as RideMediaManifest;
    }

    const selectedActivities = [
      ...selectTripActivities(activities, source),
      ...selectTripBonusRides(activities, source),
      ...selectTripOutings(activities, source),
    ].sort((first, second) => first.start_date_local.localeCompare(second.start_date_local));
    const manifest: RideMediaManifest = {photos: {}};

    for (const activity of selectedActivities) {
      if ((activity.total_photo_count ?? activity.photo_count ?? 0) === 0) {
        continue;
      }

      try {
        const result = await syncActivityPhoto(activity, source.slug, accessToken);

        if (result.requestedPhotoList) {
          requestCount += 1;
        }

        if (result.photo !== undefined) {
          const activityId = String(activity.id);
          manifest.photos[activityId] = {
            ...result.photo,
            alt: existingManifest.photos[activityId]?.alt ?? result.photo.alt,
          };
          await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
        }

        if (result.requestedPhotoList) {
          successfulPhotoRequests += 1;
        }
      } catch (error) {
        failedPhotoRequests += 1;
        process.stderr.write(`${source.slug} / ${activity.id}: ${errorMessage(error)}\n`);

        if (successfulPhotoRequests === 0 && failedPhotoRequests >= 3) {
          throw new Error("Strava photo requests are failing systemically; stopped after three consecutive failures.", {
            cause: error,
          });
        }
      }

      if (requestCount >= 85) {
        throw new Error(
          "Stopped after 85 uncached Strava photo-list requests to respect the 100 requests per 15 minutes limit. Re-run after the window resets; cached activities will be skipped.",
        );
      }
    }

    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  }

  process.stdout.write(
    `Ride media sync complete: ${successfulPhotoRequests} photo lists fetched, ${failedPhotoRequests} activity failures.\n`,
  );
}

async function syncActivityPhoto(
  activity: StravaActivitySummary,
  tripSlug: string,
  accessToken: string,
): Promise<ActivityPhotoSync> {
  const privateDirectory = `${PRIVATE_PHOTO_ROOT}/${activity.id}`;
  const photoListPath = `${privateDirectory}/list.json`;
  const requestedPhotoList = !(await exists(photoListPath));

  await mkdir(privateDirectory, {recursive: true});

  let photos: StravaPhoto[];

  if (requestedPhotoList) {
    photos = await fetchPhotoList(activity.id, accessToken, photoListPath);
  } else {
    photos = JSON.parse(await readFile(photoListPath, "utf8")) as StravaPhoto[];
  }

  const photo = photos.find(candidate => candidate.primary === true || candidate.default_photo === true) ?? photos[0];
  const photoUrl = largestPhotoUrl(photo);

  if (photo === undefined || photoUrl === undefined) {
    return {requestedPhotoList};
  }

  const rawPath = `${privateDirectory}/original-${photo.unique_id ?? "selected"}`;
  let raw: Buffer;

  if (await exists(rawPath)) {
    raw = await readFile(rawPath);
  } else {
    raw = await downloadPhoto(photoUrl, rawPath);
  }

  const publicDirectory = `${ROOT}/src/content/trip/entries/${tripSlug}/_assets/ride-log`;
  const filename = `${activity.id}.webp`;

  await mkdir(publicDirectory, {recursive: true});
  await sharp(raw)
    .rotate()
    .resize({width: 1600, height: 1200, fit: "inside", withoutEnlargement: true})
    .webp({quality: 82})
    .toFile(`${publicDirectory}/${filename}`);
  await verifySanitisedImage(`${publicDirectory}/${filename}`);

  return {
    requestedPhotoList,
    photo: {
      file: filename,
      alt: `Highlight photograph from ${activity.name}`,
    },
  };
}

async function fetchPhotoList(activityId: number, accessToken: string, destination: string): Promise<StravaPhoto[]> {
  const response = await fetch(`${apiBase}/api/v3/activities/${activityId}/photos?size=2048`, {
    headers: {Authorization: `Bearer ${accessToken}`},
  });

  if (!response.ok) {
    throw new Error(`photo-list request failed with status ${response.status}`);
  }

  const photos = (await response.json()) as StravaPhoto[];
  await writeFile(destination, `${JSON.stringify(photos, null, 2)}\n`);
  return photos;
}

function largestPhotoUrl(photo: StravaPhoto | undefined): string | undefined {
  if (photo?.urls === undefined) {
    return undefined;
  }

  return Object.entries(photo.urls)
    .sort(([first], [second]) => Number(second) - Number(first))
    .map(([, url]) => url)
    .find((url): url is string => typeof url === "string" && url.startsWith("https://"));
}

async function downloadPhoto(url: string, destination: string): Promise<Buffer> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`photo download failed with status ${response.status}`);
  }

  const photo = Buffer.from(await response.arrayBuffer());
  await writeFile(destination, photo);
  return photo;
}

async function verifySanitisedImage(path: string): Promise<void> {
  if (hasSensitiveMetadata(await sharp(path).metadata())) {
    throw new Error(`Sensitive metadata remains in ${path}.`);
  }
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "unknown error";
}
