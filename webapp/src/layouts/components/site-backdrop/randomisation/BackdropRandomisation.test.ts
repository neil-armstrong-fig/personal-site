import {describe, expect, it} from "vitest";

import {randomPlacement} from "@src/layouts/components/site-backdrop/randomisation/BackdropRandomisation";

describe("randomPlacement", () => {
  it("maps the lowest random value to the lower bounds", () => {
    expect(randomPlacement(() => 0)).toEqual({
      left: 0,
      top: 0,
      delay: 0,
      duration: 16,
      pathClass: "animate-roam-a",
      direction: "normal",
    });
  });

  it("keeps the highest random value inside the upper bounds", () => {
    const placement = randomPlacement(() => 0.999999);
    expect(placement.left).toBeLessThanOrEqual(92);
    expect(placement.top).toBeLessThanOrEqual(88);
    expect(placement.delay).toBeLessThanOrEqual(40);
    expect(placement.duration).toBeLessThanOrEqual(36);
    expect(placement.pathClass).toBe("animate-roam-d");
    expect(placement.direction).toBe("reverse");
  });

  it("gives different placements for different random values", () => {
    const low = randomPlacement(() => 0.1);
    const high = randomPlacement(() => 0.8);
    expect(low).not.toEqual(high);
  });

  it("draws each property independently", () => {
    const values = [0.5, 0.25, 0.75, 0.5, 0.3, 0.9];
    let next = 0;
    const placement = randomPlacement(() => values[next++] as number);
    expect(placement.left).toBeCloseTo(46);
    expect(placement.top).toBeCloseTo(22);
    expect(placement.delay).toBeCloseTo(30);
    expect(placement.duration).toBeCloseTo(26);
    expect(placement.pathClass).toBe("animate-roam-b");
    expect(placement.direction).toBe("reverse");
  });
});
