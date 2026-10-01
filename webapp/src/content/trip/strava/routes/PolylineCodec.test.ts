import {expect, it} from "vitest";

import {PolylineCodec} from "./PolylineCodec";

it("decodes the standard encoded-polyline example", () => {
  expect(PolylineCodec.decode("_p~iF~ps|U_ulLnnqC_mqNvxq`@")).toEqual([
    [38.5, -120.2],
    [40.7, -120.95],
    [43.252, -126.453],
  ]);
});

it("round-trips latitude and longitude points at five-decimal precision", () => {
  const points: [number, number][] = [
    [54.60123, -5.91234],
    [54.61234, -5.90123],
  ];

  expect(PolylineCodec.decode(PolylineCodec.encode(points))).toEqual(points);
});
