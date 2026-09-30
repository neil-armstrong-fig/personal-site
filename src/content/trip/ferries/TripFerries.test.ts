import {expect, it} from "vitest";

import {getTripRoutes} from "@src/content/trip/strava/routes/GetTripRoutes";
import {PolylineCodec} from "@src/content/trip/strava/routes/PolylineCodec";
import {getTripFerries} from "./GetTripFerries";

const EXPECTED_FERRY_COUNTS: Readonly<Record<string, number>> = {
  "belfast-rotterdam-2023": 4,
  "belfast-rotterdam-2024": 4,
  "loop-of-europe": 1,
  "porto-to-faro": 3,
  "tokyo-to-seoul": 3,
};

it("loads the reviewed ferry crossings for each trip that contains them", () => {
  for (const [tripId, expectedCount] of Object.entries(EXPECTED_FERRY_COUNTS)) {
    expect(getTripFerries(tripId)).toHaveLength(expectedCount);
  }

  expect(getTripFerries("rotterdam-to-rotterdam")).toEqual([]);
});

it("keeps ferry identifiers, geometry and authoritative sources valid", () => {
  const identifiers = new Set<string>();

  for (const tripId of Object.keys(EXPECTED_FERRY_COUNTS)) {
    for (const ferry of getTripFerries(tripId)) {
      expect(identifiers.has(ferry.id)).toBe(false);
      identifiers.add(ferry.id);
      expect(ferry.name.trim()).not.toBe("");
      expect(ferry.points.length).toBeGreaterThanOrEqual(2);
      expect(new URL(ferry.sourceUrl).protocol).toBe("https:");

      for (const [latitude, longitude] of ferry.points) {
        expect(latitude).toBeGreaterThanOrEqual(-90);
        expect(latitude).toBeLessThanOrEqual(90);
        expect(longitude).toBeGreaterThanOrEqual(-180);
        expect(longitude).toBeLessThanOrEqual(180);
      }
    }
  }
});

it("anchors each replaced ferry chord to ordered points in its recorded activity", () => {
  for (const tripId of Object.keys(EXPECTED_FERRY_COUNTS)) {
    const routes = getTripRoutes(tripId);

    expect(routes).toBeDefined();

    for (const ferry of getTripFerries(tripId).filter(candidate => candidate.activityId !== undefined)) {
      const encodedRoute = routes?.routes[String(ferry.activityId)];

      expect(encodedRoute).toBeDefined();

      if (encodedRoute === undefined) {
        continue;
      }

      const points = PolylineCodec.decode(encodedRoute);
      const departureIndex = points.findIndex(point => JSON.stringify(point) === JSON.stringify(ferry.points[0]));
      const arrivalIndex = points.findIndex(point => JSON.stringify(point) === JSON.stringify(ferry.points.at(-1)));

      expect(departureIndex).toBeGreaterThanOrEqual(0);
      expect(arrivalIndex).toBeGreaterThan(departureIndex);
    }
  }
});
