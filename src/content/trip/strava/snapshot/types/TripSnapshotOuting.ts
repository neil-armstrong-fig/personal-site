import type {TripSnapshotMeasurements} from "./TripSnapshotMeasurements.ts";

type TripSnapshotOutingKind = "walk" | "hike";

export interface TripSnapshotOuting extends TripSnapshotMeasurements {
  kind: TripSnapshotOutingKind;
}
