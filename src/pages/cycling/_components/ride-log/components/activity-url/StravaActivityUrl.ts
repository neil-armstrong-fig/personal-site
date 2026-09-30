import type {TripSnapshotMeasurements} from "@src/content/trip/strava/snapshot/types/TripSnapshotMeasurements";

type OptionalActivityUrl = string | undefined;

export function stravaActivityUrl(activity: TripSnapshotMeasurements): OptionalActivityUrl {
  if (!activity.public) {
    return undefined;
  }

  return `https://www.strava.com/activities/${activity.id}`;
}
