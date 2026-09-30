import {afterEach, expect, it, vi} from "vitest";

import {tripVideoNode} from "./TripVideoNode";
import {tripVideoOrigin} from "./TripVideoOrigin";

afterEach(() => {
  vi.unstubAllEnvs();
});

it("serves the clip from the media origin and defers the locally hosted poster to a data attribute", () => {
  const node = tripVideoNode({path: "/trips/porto-to-faro/coast.mp4", alt: "Riding the coast"});

  expect(node).toEqual({
    type: "tripVideo",
    data: {
      hName: "video",
      hProperties: {
        src: `${tripVideoOrigin}/trips/porto-to-faro/coast.mp4`,
        dataPoster: "/trips/porto-to-faro/coast.jpg",
        controls: true,
        preload: "none",
        playsInline: true,
        ariaLabel: "Riding the coast",
      },
    },
    children: [{type: "text", value: "Riding the coast"}],
  });
});

it("serves the clip from the local public folder when TRIP_VIDEOS_LOCAL is set", () => {
  vi.stubEnv("TRIP_VIDEOS_LOCAL", "1");

  const node = tripVideoNode({path: "/trips/porto-to-faro/coast.mp4", alt: "Riding the coast"});

  expect(node.data.hProperties.src).toBe("/trips/porto-to-faro/coast.mp4");
});
