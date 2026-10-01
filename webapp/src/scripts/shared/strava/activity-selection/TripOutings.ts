import type {StravaActivitySummary} from "@src/scripts/shared/strava/types/StravaActivitySummary.ts";
import type {TripSource} from "@src/scripts/shared/strava/types/TripSource.ts";

const minimumOutingMetres = 10_000;
const outingSportTypes: ReadonlySet<string> = new Set(["Walk", "Hike"]);

export function selectTripOutings(
  activities: readonly StravaActivitySummary[],
  source: TripSource,
): StravaActivitySummary[] {
  return activities
    .filter(
      activity =>
        outingSportTypes.has(activity.sport_type) &&
        activity.distance >= minimumOutingMetres &&
        source.prefixPattern.test(activity.name),
    )
    .sort((first, second) => first.start_date_local.localeCompare(second.start_date_local));
}
