import type {PendingTripRoutePointGroup} from "@src/pages/cycling/_components/route-maps/trip-map/types/PendingTripRoutePointGroup";

export function orderPointGroupsForRendering(
  pointGroups: readonly PendingTripRoutePointGroup[],
): PendingTripRoutePointGroup[] {
  const recordedPointGroups = pointGroups.filter(pointGroup => pointGroup.kind !== "transit");
  const transitPointGroups = pointGroups.filter(pointGroup => pointGroup.kind === "transit");
  return [...recordedPointGroups, ...transitPointGroups];
}
