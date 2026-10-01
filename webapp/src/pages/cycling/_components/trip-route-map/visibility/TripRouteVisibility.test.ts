import {expect, it} from "vitest";

import {isTripRouteLayerVisible} from "./TripRouteVisibility";

const allVisible = {ferriesVisible: true, outingsVisible: true, transitVisible: true};

it("always keeps cycling layers visible", () => {
  for (const kind of ["ride", "transition", "bonus"] as const) {
    expect(isTripRouteLayerVisible({ferriesVisible: false, kind, outingsVisible: false, transitVisible: false})).toBe(
      true,
    );
  }
});

it("toggles ferries without changing cycling layers", () => {
  expect(isTripRouteLayerVisible({...allVisible, ferriesVisible: false, kind: "ferry"})).toBe(false);
  expect(isTripRouteLayerVisible({...allVisible, ferriesVisible: false, kind: "ride"})).toBe(true);
});

it("toggles walks and hikes together without changing transit", () => {
  expect(isTripRouteLayerVisible({...allVisible, kind: "walk", outingsVisible: false})).toBe(false);
  expect(isTripRouteLayerVisible({...allVisible, kind: "hike", outingsVisible: false})).toBe(false);
  expect(isTripRouteLayerVisible({...allVisible, kind: "transit", outingsVisible: false})).toBe(true);
});

it("toggles transit without changing walks and hikes", () => {
  expect(isTripRouteLayerVisible({...allVisible, kind: "transit", transitVisible: false})).toBe(false);
  expect(isTripRouteLayerVisible({...allVisible, kind: "walk", transitVisible: false})).toBe(true);
  expect(isTripRouteLayerVisible({...allVisible, kind: "hike", transitVisible: false})).toBe(true);
});
