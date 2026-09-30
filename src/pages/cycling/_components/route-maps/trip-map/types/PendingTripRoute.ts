import type {PendingTripRoutePointGroup} from "./PendingTripRoutePointGroup";
import type {TripRouteMetadata} from "./TripRouteMetadata";

export interface PendingTripRoute {
  metadata: TripRouteMetadata;
  pointGroups: PendingTripRoutePointGroup[];
}
