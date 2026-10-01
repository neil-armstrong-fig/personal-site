import type {TripSnapshotDay} from "./types/TripSnapshotDay";

interface SnapshotDaysSummary {
  days: number;
  transitionDays: number;
  bonusRides: number;
  distanceMetres: number;
  elevationMetres: number;
}

// Mirrors the totals rules in the sync-strava build script (a day counts as a riding day unless it is a bonus
// ride or a short transition), scoped to whichever subset of days the caller hands in.
export function summariseSnapshotDays(days: readonly TripSnapshotDay[]): SnapshotDaysSummary {
  return {
    days: days.filter(day => day.bonus !== true && day.transition !== true).length,
    transitionDays: days.filter(day => day.transition === true).length,
    bonusRides: days.filter(day => day.bonus === true).length,
    distanceMetres: sum(days, day => day.distanceMetres),
    elevationMetres: sum(days, day => day.elevationMetres),
  };
}

function sum(days: readonly TripSnapshotDay[], select: (day: TripSnapshotDay) => number): number {
  return days.reduce((total, day) => total + select(day), 0);
}
