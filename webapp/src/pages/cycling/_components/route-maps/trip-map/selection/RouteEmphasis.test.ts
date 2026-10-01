import {expect, it} from "vitest";

import {routeEmphasis} from "./RouteEmphasis";

it("treats every route as visible but unemphasised with no selection and no highlighted set", () => {
  expect(routeEmphasis("123", {selectedRouteId: ""})).toEqual({visible: true, emphasised: false});
});

it("shows only the explicitly selected route, regardless of any highlighted set", () => {
  const state = {selectedRouteId: "123", highlightedRouteIds: new Set(["456"])};

  expect(routeEmphasis("123", state)).toEqual({visible: true, emphasised: true});
  expect(routeEmphasis("456", state)).toEqual({visible: false, emphasised: false});
});

it("falls back to the highlighted set when nothing is explicitly selected", () => {
  const state = {selectedRouteId: "", highlightedRouteIds: new Set(["123"])};

  expect(routeEmphasis("123", state)).toEqual({visible: true, emphasised: true});
  expect(routeEmphasis("456", state)).toEqual({visible: false, emphasised: false});
});
