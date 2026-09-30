import type {TripSnapshotMeasurements} from "./TripSnapshotMeasurements.ts";

export interface TripSnapshotDay extends TripSnapshotMeasurements {
  // One-based leg number for multi-leg trips, in order of first appearance.
  leg?: number;
  transition?: true;
  bonus?: true;
}
