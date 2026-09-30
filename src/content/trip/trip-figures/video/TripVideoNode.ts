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
  poster: string;
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
        src: path,
        poster: path.replace(/\.mp4$/i, ".jpg"),
        controls: true,
        preload: "none",
        playsInline: true,
        ariaLabel: alt,
      },
    },
    children: [{type: "text", value: alt}],
  };
}
