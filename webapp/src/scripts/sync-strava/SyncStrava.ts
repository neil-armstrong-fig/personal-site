import {mkdir, writeFile} from "node:fs/promises";

import {selectTripActivities} from "@src/scripts/shared/strava/activity-selection/TripActivities";
import {selectTripBonusRides} from "@src/scripts/shared/strava/activity-selection/TripBonusRides";
import {selectTripOutings} from "@src/scripts/shared/strava/activity-selection/TripOutings";
import {persistRotatedRefreshToken} from "@src/scripts/shared/strava/environment/PersistRotatedRefreshToken";
import {stravaCredentialsFromEnvironment} from "@src/scripts/shared/strava/environment/StravaCredentialsFromEnvironment";
import {tripSources} from "@src/scripts/shared/strava/trip-sources/TripSources";
import {buildTripRoutes} from "@src/scripts/sync-strava/build-trip-routes/BuildTripRoutes";
import {buildTripSnapshot} from "@src/scripts/sync-strava/build-trip-snapshot/BuildTripSnapshot";
import {fetchAllActivities} from "@src/scripts/sync-strava/strava-client/StravaClient";
import {repositoryRoot} from "@src/scripts/shared/repository/RepositoryRoot";

const ROOT = process.cwd();

await syncStrava();

async function syncStrava(): Promise<void> {
  const {activities, refreshToken} = await fetchAllActivities(stravaCredentialsFromEnvironment());

  await persistRotatedRefreshToken(refreshToken);

  // Raw responses include coordinates, so they stay in the ignored private directory.
  await mkdir(`${repositoryRoot}/private-source/strava`, {recursive: true});
  await writeFile(
    `${repositoryRoot}/private-source/strava/activities.json`,
    `${JSON.stringify(activities, null, 2)}\n`,
  );

  for (const source of tripSources) {
    const tripActivities = selectTripActivities(activities, source);
    const bonusRides = selectTripBonusRides(activities, source);
    const outings = selectTripOutings(activities, source);
    const cyclingActivities = [...tripActivities, ...bonusRides].sort((first, second) =>
      first.start_date_local.localeCompare(second.start_date_local),
    );
    const snapshot = buildTripSnapshot(tripActivities, source, {bonusRides, outings});
    const routes = buildTripRoutes([...cyclingActivities, ...outings], {
      firstActivityId: tripActivities.at(0)?.id,
      lastActivityId: tripActivities.at(-1)?.id,
      trimBothActivityIds: bonusRides.map(ride => ride.id),
      trimMetres: 5_000,
    });
    const directory = `${ROOT}/src/content/trip/entries/${source.slug}`;

    await mkdir(directory, {recursive: true});
    await writeFile(`${directory}/strava.json`, `${JSON.stringify(snapshot, null, 2)}\n`);
    await writeFile(`${directory}/routes.json`, `${JSON.stringify(routes, null, 2)}\n`);

    const {days, bonusRides: bonusRideCount, distanceMetres, elevationMetres} = snapshot.totals;
    process.stdout.write(
      `${source.slug}: ${days} days + ${bonusRideCount} bonus rides, ${(distanceMetres / 1000).toFixed(1)} km, ${elevationMetres} m climbing\n`,
    );
  }
}
