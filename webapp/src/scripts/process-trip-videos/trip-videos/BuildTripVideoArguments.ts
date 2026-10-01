interface TripVideoOptions {
  source: string;
  destination: string;
  muteAudio?: boolean;
}

const LONG_EDGE_PX = 1280;
const LONGEST_EDGE_FILTER = `scale='if(gt(iw,ih),min(${LONG_EDGE_PX},iw),-2)':'if(gt(iw,ih),-2,min(${LONG_EDGE_PX},ih))'`;

export function buildTripVideoArguments({source, destination, muteAudio = false}: TripVideoOptions): string[] {
  return [
    "-y",
    "-i",
    source,
    "-map_metadata",
    "-1",
    "-map_chapters",
    "-1",
    "-vf",
    LONGEST_EDGE_FILTER,
    "-r",
    "30",
    "-c:v",
    "libx264",
    "-crf",
    "30",
    "-preset",
    "slow",
    "-pix_fmt",
    "yuv420p",
    ...buildAudioArguments(muteAudio),
    "-movflags",
    "+faststart",
    destination,
  ];
}

function buildAudioArguments(muteAudio: boolean): string[] {
  if (muteAudio) {
    return ["-an"];
  }

  return ["-c:a", "aac", "-b:a", "96k"];
}
