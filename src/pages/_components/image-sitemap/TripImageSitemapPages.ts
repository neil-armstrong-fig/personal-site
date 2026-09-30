import type {ImageMetadata} from "astro";

import type {RideMedia} from "@src/content/trip/strava/ride-media/types/RideMedia";
import {parseTripChapterId} from "@src/content/trip/trip-chapter/ParseTripChapterId";
import {getTripStoryFigures} from "@src/content/trip/trip-figures/story-figures/TripStoryFigures";
import type {SitemapImage} from "./types/SitemapImage";
import type {SitemapPage} from "./types/SitemapPage";

type OptionalImage = ImageMetadata | undefined;

interface TripImageEntryData {
  draft: boolean;
  coverImage: ImageMetadata;
  coverAlt: string;
}

interface TripRenderedMetadata {
  imagePaths?: string[];
  frontmatter?: Record<string, unknown>;
}

interface TripRenderedContent {
  metadata?: TripRenderedMetadata;
}

interface TripImageEntry {
  id: string;
  data: TripImageEntryData;
  rendered?: TripRenderedContent;
}

interface TripImageSitemapOptions {
  optimise: (source: ImageMetadata, width: number) => Promise<string>;
  pageUrl: (path: string) => string;
  resolveStoryImage: (tripId: string, path: string) => OptionalImage;
  resolveRideMedia?: (tripId: string) => readonly RideMedia[];
}

interface TripChapterImageEntryData {
  draft: boolean;
}

interface TripChapterImageEntry {
  id: string;
  data: TripChapterImageEntryData;
  rendered?: TripRenderedContent;
}

interface TripChapterImageSitemapOptions {
  optimise: (source: ImageMetadata, width: number) => Promise<string>;
  pageUrl: (path: string) => string;
  resolveStoryImage: (tripId: string, path: string) => OptionalImage;
}

export async function buildTripImageSitemapPages(
  trips: readonly TripImageEntry[],
  options: TripImageSitemapOptions,
): Promise<SitemapPage[]> {
  return Promise.all(trips.filter(trip => !trip.data.draft).map(async trip => buildTripPage(trip, options)));
}

async function buildTripPage(trip: TripImageEntry, options: TripImageSitemapOptions): Promise<SitemapPage> {
  const {coverImage, coverAlt} = trip.data;
  const images = [{url: await options.optimise(coverImage, 1280), title: coverAlt}];
  const imagePaths = new Set(trip.rendered?.metadata?.imagePaths ?? []);
  const figures = getTripStoryFigures(trip);

  for (const figure of figures) {
    if (!imagePaths.has(figure.path)) {
      throw new Error(`${trip.id}: ${figure.path} is not present in Astro's rendered Markdown image metadata.`);
    }

    const image = options.resolveStoryImage(trip.id, figure.path);

    if (image === undefined) {
      throw new Error(`${trip.id}: could not resolve story image ${figure.path}.`);
    }

    images.push({url: await options.optimise(image, 800), title: figure.caption});
  }

  for (const media of options.resolveRideMedia?.(trip.id) ?? []) {
    images.push({url: await options.optimise(media.image, 720), title: media.alt});
  }

  return {pageUrl: options.pageUrl(`/cycling/${trip.id}/`), images};
}

export async function buildTripChapterImageSitemapPages(
  chapters: readonly TripChapterImageEntry[],
  options: TripChapterImageSitemapOptions,
): Promise<SitemapPage[]> {
  return Promise.all(
    chapters.filter(chapter => !chapter.data.draft).map(async chapter => buildChapterPage(chapter, options)),
  );
}

async function buildChapterPage(
  chapter: TripChapterImageEntry,
  options: TripChapterImageSitemapOptions,
): Promise<SitemapPage> {
  const {tripSlug, chapterSlug} = parseTripChapterId(chapter.id);
  const imagePaths = new Set(chapter.rendered?.metadata?.imagePaths ?? []);
  const figures = getTripStoryFigures(chapter);
  const images: SitemapImage[] = [];

  for (const figure of figures) {
    if (!imagePaths.has(figure.path)) {
      throw new Error(`${chapter.id}: ${figure.path} is not present in Astro's rendered Markdown image metadata.`);
    }

    const image = options.resolveStoryImage(tripSlug, figure.path);

    if (image === undefined) {
      throw new Error(`${chapter.id}: could not resolve story image ${figure.path}.`);
    }

    images.push({url: await options.optimise(image, 800), title: figure.caption});
  }

  return {pageUrl: options.pageUrl(`/cycling/${tripSlug}/${chapterSlug}/`), images};
}
