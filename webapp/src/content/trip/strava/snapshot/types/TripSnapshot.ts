import type {TripSnapshotDay} from "./TripSnapshotDay.ts";
import type {TripSnapshotLeg} from "./TripSnapshotLeg.ts";
import type {TripSnapshotOuting} from "./TripSnapshotOuting.ts";

interface TripSnapshotTotals {
  days: number;
  transitionDays: number;
  bonusRides: number;
  distanceMetres: number;
  elevationMetres: number;
  movingTimeSeconds: number;
}

export interface TripSnapshot {
  days: TripSnapshotDay[];
  legs: TripSnapshotLeg[];
  outings: TripSnapshotOuting[];
  totals: TripSnapshotTotals;
}
