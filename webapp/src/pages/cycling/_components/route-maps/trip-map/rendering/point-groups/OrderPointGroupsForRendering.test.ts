import {expect, it} from "vitest";

import type {PendingTripRoutePointGroup} from "@src/pages/cycling/_components/route-maps/trip-map/types/PendingTripRoutePointGroup";
import {orderPointGroupsForRendering} from "./OrderPointGroupsForRendering";

it("places transit groups above recorded geometry without changing either group's order", () => {
  const pointGroups: PendingTripRoutePointGroup[] = [
    {points: [[0, 0]]},
    {kind: "transit", points: [[1, 1]]},
    {points: [[2, 2]]},
    {kind: "transit", points: [[3, 3]]},
  ];

  expect(orderPointGroupsForRendering(pointGroups)).toEqual([
    pointGroups[0],
    pointGroups[2],
    pointGroups[1],
    pointGroups[3],
  ]);
});
