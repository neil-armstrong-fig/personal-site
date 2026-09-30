import type {PolylinePoint} from "@src/content/trip/strava/routes/types/PolylinePoint";
import type {TripRouteSegmentKind} from "./TripRouteSegmentKind.ts";

export interface TripRouteSegment {
  kind: TripRouteSegmentKind;
  points: PolylinePoint[];
}
