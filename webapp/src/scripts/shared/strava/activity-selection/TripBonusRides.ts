import type {StravaActivitySummary} from "@src/scripts/shared/strava/types/StravaActivitySummary.ts";
import type {TripSource} from "@src/scripts/shared/strava/types/TripSource.ts";

const cyclingSportTypes: ReadonlySet<string> = new Set(["Ride", "GravelRide", "MountainBikeRide"]);

export function selectTripBonusRides(
  activities: readonly StravaActivitySummary[],
  source: TripSource,
): StravaActivitySummary[] {
  const {pattern, ids = []} = source.bonusRides ?? {};

  return activities
    .filter(
      activity =>
        cyclingSportTypes.has(activity.sport_type) &&
        !source.dayPattern.test(activity.name) &&
        (ids.includes(activity.id) || pattern?.test(activity.name) === true),
    )
    .sort((first, second) => first.start_date_local.localeCompare(second.start_date_local));
}
