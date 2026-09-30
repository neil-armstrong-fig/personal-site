import type {StravaActivitySummary} from "@src/scripts/shared/strava/types/StravaActivitySummary.ts";
import type {TripSnapshot} from "@src/content/trip/strava/snapshot/types/TripSnapshot.ts";
import type {TripSnapshotDay} from "@src/content/trip/strava/snapshot/types/TripSnapshotDay.ts";
import type {TripSnapshotLeg} from "@src/content/trip/strava/snapshot/types/TripSnapshotLeg.ts";
import type {TripSnapshotMeasurements} from "@src/content/trip/strava/snapshot/types/TripSnapshotMeasurements.ts";
import type {TripSnapshotOuting} from "@src/content/trip/strava/snapshot/types/TripSnapshotOuting.ts";
import type {TripSource} from "@src/scripts/shared/strava/types/TripSource.ts";

type OptionalLegNumber = number | undefined;
type OptionalDayPattern = RegExp | undefined;

interface TripSnapshotExtras {
  bonusRides?: readonly StravaActivitySummary[];
  outings?: readonly StravaActivitySummary[];
}

interface TripSnapshotDayOptions {
  source: TripSource;
  legNumbers: Map<string, number>;
  bonusIds: ReadonlySet<number>;
  transitionIds: ReadonlySet<number>;
}

// Copies only whitelisted numeric and text fields, so coordinates and polylines can never reach the snapshot.
export function buildTripSnapshot(
  activities: readonly StravaActivitySummary[],
  source: TripSource,
  extras: TripSnapshotExtras = {},
): TripSnapshot {
  const legNumbers = new Map<string, number>();
  const bonusIds = new Set((extras.bonusRides ?? []).map(ride => ride.id));
  const transitionIds = new Set(source.transitionActivityIds ?? []);
  const dayOptions: TripSnapshotDayOptions = {source, legNumbers, bonusIds, transitionIds};
  const days = [...activities, ...(extras.bonusRides ?? [])]
    .sort((first, second) => first.start_date_local.localeCompare(second.start_date_local))
    .map(activity => toSnapshotDay(activity, dayOptions));

  return {
    days,
    legs: [...legNumbers].map(([code, number]): TripSnapshotLeg => ({number, name: legName(code, source)})),
    outings: (extras.outings ?? []).map(toSnapshotOuting),
    totals: {
      days: days.filter(day => day.bonus !== true && day.transition !== true).length,
      transitionDays: days.filter(day => day.transition === true).length,
      bonusRides: days.filter(day => day.bonus === true).length,
      distanceMetres: sum(days, day => day.distanceMetres),
      elevationMetres: sum(days, day => day.elevationMetres),
      movingTimeSeconds: sum(days, day => day.movingTimeSeconds),
    },
  };
}

function toSnapshotDay(activity: StravaActivitySummary, options: TripSnapshotDayOptions): TripSnapshotDay {
  const {source, legNumbers, bonusIds, transitionIds} = options;
  const bonus = bonusIds.has(activity.id);
  let dayPattern: OptionalDayPattern = source.dayPattern;

  if (bonus) {
    dayPattern = source.bonusRides?.pattern;
  }

  const groups = dayPattern?.exec(activity.name)?.groups;
  const legCode = groups?.["leg"]?.toUpperCase();
  let leg: OptionalLegNumber;

  if (legCode !== undefined) {
    leg = legNumber(legCode, legNumbers);
  }

  const transition =
    !bonus &&
    (transitionIds.has(activity.id) || (legCode !== undefined && source.legs?.[legCode]?.transition === true));
  const day: TripSnapshotDay = measurements(activity);

  if (leg !== undefined) {
    day.leg = leg;
  }

  if (transition) {
    day.transition = true;
  }

  if (bonus) {
    day.bonus = true;
  }

  return day;
}

function toSnapshotOuting(activity: StravaActivitySummary): TripSnapshotOuting {
  let kind: TripSnapshotOuting["kind"] = "walk";

  if (activity.sport_type === "Hike") {
    kind = "hike";
  }

  return {
    ...measurements(activity),
    kind,
  };
}

function measurements(activity: StravaActivitySummary): TripSnapshotMeasurements {
  return {
    id: activity.id,
    date: activity.start_date_local.slice(0, 10),
    name: activity.name,
    distanceMetres: Math.round(activity.distance),
    elevationMetres: Math.round(activity.total_elevation_gain),
    movingTimeSeconds: activity.moving_time,
    public: activity.visibility === "everyone",
  };
}

function legName(code: string, source: TripSource): string {
  const leg = source.legs?.[code];

  if (leg === undefined) {
    throw new Error(`${source.slug} has no configured name for leg ${code}.`);
  }

  return leg.name;
}

function legNumber(code: string, legNumbers: Map<string, number>): number {
  const existing = legNumbers.get(code);

  if (existing !== undefined) {
    return existing;
  }

  const next = legNumbers.size + 1;
  legNumbers.set(code, next);

  return next;
}

function sum(days: readonly TripSnapshotDay[], select: (day: TripSnapshotDay) => number): number {
  return days.reduce((total, day) => total + select(day), 0);
}
