import {z} from "astro/zod";

import {parseTripPhotos} from "@src/scripts/shared/trip-photos/ParseTripPhotos";
import type {TripPhoto} from "@src/scripts/shared/trip-photos/types/TripPhoto";

interface TripVideo extends TripPhoto {
  muteAudio: boolean;
}

const manifestSchema = z.object({videos: z.array(z.unknown())});
const tripVideoOptionsSchema = z.object({muteAudio: z.boolean().optional()});

// Reuse the trip-photo parser for the shared source, output-name and alt-text fields.
export function parseTripVideos(manifest: unknown): TripVideo[] {
  const {videos} = manifestSchema.parse(manifest);
  const parsed = parseTripPhotos({photos: videos});

  return parsed.map((video, index) => {
    if (!/\.mp4$/i.test(video.source)) {
      throw new Error(`Video source must be an MP4: ${video.source}`);
    }

    const options = tripVideoOptionsSchema.parse(videos[index]);

    return {...video, muteAudio: options.muteAudio ?? false};
  });
}
