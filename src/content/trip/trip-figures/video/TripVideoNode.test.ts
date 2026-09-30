import {expect, it} from "vitest";

import {tripVideoNode} from "./TripVideoNode";
import {tripVideoOrigin} from "./TripVideoOrigin";

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
