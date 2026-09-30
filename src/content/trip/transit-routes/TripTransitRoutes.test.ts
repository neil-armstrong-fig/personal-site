import {expect, it} from "vitest";

import {getTripSnapshot} from "@src/content/trip/strava/snapshot/GetTripSnapshot";
import {getTripTransitRoutes} from "./GetTripTransitRoutes";

it("loads the reviewed Eindhoven to Rotterdam train return", () => {
  const transitRoutes = getTripTransitRoutes("belfast-rotterdam-2024");

  expect(transitRoutes).toHaveLength(1);
  expect(transitRoutes[0]).toMatchObject({
    id: "belfast-rotterdam-2024-eindhoven-rotterdam-train",
    activityId: 12358292078,
    name: "Train from Eindhoven to Rotterdam",
    sourceUrl: "https://assets.travelsupport-p.cla.ns.nl/stations/vertrekstaten/EHV-3.pdf",
  });
  expect(transitRoutes[0]?.points[0]).toEqual([51.4433, 5.4813]);
  expect(transitRoutes[0]?.points.at(-1)).toEqual([51.9245, 4.4689]);
  expect(getTripTransitRoutes("rotterdam-to-rotterdam")).toEqual([]);
});

it("keeps reviewed transit routes attached to mapped activities with valid public geometry", () => {
  const tripId = "belfast-rotterdam-2024";
  const snapshot = getTripSnapshot(tripId);
  const mappedActivityIds = new Set([
    ...(snapshot?.days.map(day => day.id) ?? []),
    ...(snapshot?.outings.map(outing => outing.id) ?? []),
  ]);

  for (const transitRoute of getTripTransitRoutes(tripId)) {
    expect(mappedActivityIds.has(transitRoute.activityId)).toBe(true);
    expect(transitRoute.id.trim()).not.toBe("");
    expect(transitRoute.name.trim()).not.toBe("");
    expect(transitRoute.points.length).toBeGreaterThanOrEqual(2);
    expect(new URL(transitRoute.sourceUrl).protocol).toBe("https:");

    for (const [latitude, longitude] of transitRoute.points) {
      expect(latitude).toBeGreaterThanOrEqual(-90);
      expect(latitude).toBeLessThanOrEqual(90);
      expect(longitude).toBeGreaterThanOrEqual(-180);
      expect(longitude).toBeLessThanOrEqual(180);
    }
  }
});
