import type {APIRoute, ImageMetadata} from "astro";
import {getImage} from "astro:assets";

import {getPublishedTrips} from "@src/content/trip/GetPublishedTrips";
import {getPublishedTripChapters} from "@src/content/trip/trip-chapter/GetPublishedTripChapters";
import {getTripRideMedia} from "@src/content/trip/strava/ride-media/TripRideMedia";
import {buildImageSitemap} from "@src/pages/_components/image-sitemap/ImageSitemap";
import {
  buildTripChapterImageSitemapPages,
  buildTripImageSitemapPages,
} from "@src/pages/_components/image-sitemap/TripImageSitemapPages";
import {absoluteUrl} from "@src/site/urls/AbsoluteUrl";

type OptionalImage = ImageMetadata | undefined;

const storyImages = import.meta.glob<ImageMetadata>("/src/content/trip/entries/*/_assets/*.{avif,jpeg,jpg,png,webp}", {
  eager: true,
  import: "default",
});

export const GET: APIRoute = async () => {
  const trips = await getPublishedTrips();
  const chapters = (await Promise.all(trips.map(async trip => getPublishedTripChapters(trip.id)))).flat();

  const tripPages = await buildTripImageSitemapPages(trips, {
    optimise: optimisedUrl,
    pageUrl: absoluteUrl,
    resolveStoryImage,
    resolveRideMedia: tripId => Object.values(getTripRideMedia(tripId)),
  });

  const chapterPages = await buildTripChapterImageSitemapPages(chapters, {
    optimise: optimisedUrl,
    pageUrl: absoluteUrl,
    resolveStoryImage,
  });

  return new Response(buildImageSitemap([...tripPages, ...chapterPages]), {
    headers: {"Content-Type": "application/xml; charset=utf-8"},
  });
};

async function optimisedUrl(source: ImageMetadata, width: number): Promise<string> {
  return absoluteUrl((await getImage({src: source, width})).src);
}

function resolveStoryImage(tripId: string, path: string): OptionalImage {
  const relativePath = path.replace(/^\.\//, "");

  return storyImages[`/src/content/trip/entries/${tripId}/${relativePath}`];
}
