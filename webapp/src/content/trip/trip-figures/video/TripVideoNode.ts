import {tripVideoOrigin} from "./TripVideoOrigin";

interface TripVideoSource {
  path: string;
  alt: string;
}

interface TripVideoTextNode {
  type: "text";
  value: string;
}

interface TripVideoNode {
  type: "tripVideo";
  data: {hName: "video"; hProperties: TripVideoProperties};
  children: TripVideoTextNode[];
}

interface TripVideoProperties {
  src: string;
  dataPoster: string;
  controls: true;
  preload: "none";
  playsInline: true;
  ariaLabel: string;
}

export function tripVideoNode({path, alt}: TripVideoSource): TripVideoNode {
  return {
    type: "tripVideo",
    data: {
      hName: "video",
      hProperties: {
        src: `${clipOrigin()}${path}`,
        dataPoster: path.replace(/\.mp4$/i, ".jpg"),
        controls: true,
        preload: "none",
        playsInline: true,
        ariaLabel: alt,
      },
    },
    children: [{type: "text", value: alt}],
  };
}

// `pnpm dev` sets TRIP_VIDEOS_LOCAL so a draft's clips play from the gitignored `public/trips/` before they are
// uploaded; builds never set it, and `validate-build` checks every published clip exists on the media origin.
function clipOrigin(): string {
  if (process.env["TRIP_VIDEOS_LOCAL"] === "1") {
    return "";
  }

  return tripVideoOrigin;
}
