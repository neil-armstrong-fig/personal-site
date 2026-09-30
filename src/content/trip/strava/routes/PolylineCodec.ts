import type {PolylinePoint} from "./types/PolylinePoint.ts";

interface DecodedValue {
  index: number;
  value: number;
}

export const PolylineCodec = {
  decode(polyline: string): PolylinePoint[] {
    const points: PolylinePoint[] = [];
    let index = 0;
    let latitude = 0;
    let longitude = 0;

    while (index < polyline.length) {
      const latitudeResult = decodeValue(polyline, index);
      index = latitudeResult.index;
      latitude += latitudeResult.value;

      const longitudeResult = decodeValue(polyline, index);
      index = longitudeResult.index;
      longitude += longitudeResult.value;

      points.push([latitude / 100_000, longitude / 100_000]);
    }

    return points;
  },

  encode(points: readonly PolylinePoint[]): string {
    let previousLatitude = 0;
    let previousLongitude = 0;
    let polyline = "";

    for (const [latitude, longitude] of points) {
      const latitudeValue = Math.round(latitude * 100_000);
      const longitudeValue = Math.round(longitude * 100_000);
      polyline += encodeValue(latitudeValue - previousLatitude);
      polyline += encodeValue(longitudeValue - previousLongitude);
      previousLatitude = latitudeValue;
      previousLongitude = longitudeValue;
    }

    return polyline;
  },
} as const;

function decodeValue(polyline: string, startIndex: number): DecodedValue {
  let index = startIndex;
  let result = 0;
  let shift = 0;
  let byte: number;

  do {
    const character = polyline.charCodeAt(index);

    if (Number.isNaN(character)) {
      throw new Error("Invalid encoded polyline.");
    }

    index += 1;
    byte = character - 63;
    result |= (byte & 0x1f) << shift;
    shift += 5;
  } while (byte >= 0x20);

  let value = result >> 1;

  if ((result & 1) === 1) {
    value = ~value;
  }

  return {index, value};
}

function encodeValue(value: number): string {
  let remaining = value << 1;

  if (value < 0) {
    remaining = ~remaining;
  }

  let encoded = "";

  while (remaining >= 0x20) {
    encoded += String.fromCharCode((0x20 | (remaining & 0x1f)) + 63);
    remaining >>= 5;
  }

  return encoded + String.fromCharCode(remaining + 63);
}
