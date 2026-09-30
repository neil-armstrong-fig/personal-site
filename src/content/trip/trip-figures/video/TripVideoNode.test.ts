import {expect, it} from "vitest";

import {tripVideoNode} from "./TripVideoNode";

it("builds a lazy, controlled video with a poster from the same name", () => {
  const node = tripVideoNode({path: "/trips/porto-to-faro/coast.mp4", alt: "Riding the coast"});

  expect(node).toEqual({
    type: "tripVideo",
    data: {
      hName: "video",
      hProperties: {
        src: "/trips/porto-to-faro/coast.mp4",
        poster: "/trips/porto-to-faro/coast.jpg",
        controls: true,
        preload: "none",
        playsInline: true,
        ariaLabel: "Riding the coast",
      },
    },
    children: [{type: "text", value: "Riding the coast"}],
  });
});
