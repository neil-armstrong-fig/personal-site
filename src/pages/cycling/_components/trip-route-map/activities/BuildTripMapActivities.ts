import type {TripSnapshot} from "@src/content/trip/strava/snapshot/types/TripSnapshot";
import type {TripSnapshotDay} from "@src/content/trip/strava/snapshot/types/TripSnapshotDay";
import type {TripSnapshotOuting} from "@src/content/trip/strava/snapshot/types/TripSnapshotOuting";
import type {TripMapActivity} from "@src/pages/cycling/_components/trip-route-map/types/TripMapActivity";
import type {TripMapActivityKind} from "@src/pages/cycling/_components/trip-route-map/types/TripMapActivityKind";

type SnapshotActivity = TripSnapshotDay | TripSnapshotOuting;

interface OrderedActivity {
  activity: SnapshotActivity;
  sourceOrder: number;
  outing: boolean;
}

export function buildTripMapActivities(
  snapshot: TripSnapshot,
  routeActivityIds: ReadonlySet<string>,
): TripMapActivity[] {
  const orderedActivities: OrderedActivity[] = [
    ...snapshot.days.map((activity, sourceOrder): OrderedActivity => ({activity, sourceOrder, outing: false})),
    ...snapshot.outings.map((activity, sourceOrder): OrderedActivity => ({activity, sourceOrder, outing: true})),
  ];
  orderedActivities.sort(compareActivities);

  let colourIndex = 0;
  const activities: TripMapActivity[] = [];

  for (const {activity} of orderedActivities) {
    if (!routeActivityIds.has(String(activity.id))) {
      continue;
    }

    const kind = activityKind(activity);
    const mapActivity: TripMapActivity = {
      id: activity.id,
      date: activity.date,
      name: activity.name,
      kind,
      start: false,
      finish: false,
    };

    if (kind !== "walk" && kind !== "hike") {
      mapActivity.colourIndex = colourIndex;
      colourIndex += 1;
    }

    activities.push(mapActivity);
  }

  markVisibleBoundaries(activities);
  return activities;
}

function compareActivities(first: OrderedActivity, second: OrderedActivity): number {
  const dateOrder = first.activity.date.localeCompare(second.activity.date);

  if (dateOrder !== 0) {
    return dateOrder;
  }

  if (first.outing !== second.outing) {
    return Number(first.outing) - Number(second.outing);
  }

  return first.sourceOrder - second.sourceOrder;
}

function activityKind(activity: SnapshotActivity): TripMapActivityKind {
  if ("kind" in activity) {
    return activity.kind;
  }

  if (activity.bonus === true) {
    return "bonus";
  }

  if (activity.transition === true) {
    return "transition";
  }

  return "ride";
}

function markVisibleBoundaries(activities: TripMapActivity[]): void {
  const cyclingActivities = activities.filter(isCyclingActivity);
  let boundaryActivities = cyclingActivities.filter(activity => activity.kind !== "bonus");

  if (boundaryActivities.length === 0) {
    boundaryActivities = cyclingActivities;
  }

  const first = boundaryActivities[0];
  const last = boundaryActivities.at(-1);

  if (first !== undefined) {
    first.start = true;
  }

  if (last !== undefined) {
    last.finish = true;
  }
}

function isCyclingActivity(activity: TripMapActivity): boolean {
  return activity.kind !== "walk" && activity.kind !== "hike";
}
