import type {ImageMetadata} from "astro";
import {expect, it} from "vitest";

import {buildTripChapterImageSitemapPages, buildTripImageSitemapPages} from "./TripImageSitemapPages";

const cover: ImageMetadata = {src: "/cover.jpg", width: 1600, height: 900, format: "jpg"};
const story: ImageMetadata = {src: "/story.jpg", width: 1200, height: 800, format: "jpg"};
const ride: ImageMetadata = {src: "/ride.webp", width: 1200, height: 800, format: "webp"};

it("includes the cover and captioned images from Astro's rendered Markdown metadata", async () => {
  const pages = await buildTripImageSitemapPages(
    [
      {
        id: "coast",
        data: {draft: false, coverImage: cover, coverAlt: "Road above the coast"},
        rendered: {
          metadata: {
            imagePaths: ["./_assets/story.jpg"],
            frontmatter: {
              tripStoryFigures: [
                {path: "./_assets/story.jpg", alt: "A bicycle by the sea", caption: "Above the Atlantic."},
              ],
            },
          },
        },
      },
    ],
    {
      optimise: async (image, width) => `${image.src}?w=${width}`,
      pageUrl: path => `https://neilarmstrong.dev${path}`,
      resolveStoryImage: () => story,
      resolveRideMedia: () => [{image: ride, alt: "A bicycle beside a canal"}],
    },
  );

  expect(pages).toEqual([
    {
      pageUrl: "https://neilarmstrong.dev/cycling/coast/",
      images: [
        {url: "/cover.jpg?w=1280", title: "Road above the coast"},
        {url: "/story.jpg?w=800", title: "Above the Atlantic."},
        {url: "/ride.webp?w=720", title: "A bicycle beside a canal"},
      ],
    },
  ]);
});

it("excludes draft trips from the image sitemap", async () => {
  const pages = await buildTripImageSitemapPages(
    [{id: "draft", data: {draft: true, coverImage: cover, coverAlt: "Unpublished"}}],
    {
      optimise: async image => image.src,
      pageUrl: path => path,
      resolveStoryImage: () => undefined,
    },
  );

  expect(pages).toEqual([]);
});

it("fails when figure metadata is not backed by Astro's rendered image list", async () => {
  const build = buildTripImageSitemapPages(
    [
      {
        id: "broken",
        data: {draft: false, coverImage: cover, coverAlt: "Cover"},
        rendered: {
          metadata: {
            imagePaths: [],
            frontmatter: {
              tripStoryFigures: [{path: "./missing.jpg", alt: "Missing", caption: "Missing."}],
            },
          },
        },
      },
    ],
    {
      optimise: async image => image.src,
      pageUrl: path => path,
      resolveStoryImage: () => story,
    },
  );

  await expect(build).rejects.toThrow("rendered Markdown image metadata");
});

it("builds one sitemap page per chapter, attributing only that chapter's own figures", async () => {
  const pages = await buildTripChapterImageSitemapPages(
    [
      {
        id: "coast/part-2-headland-to-harbour",
        data: {draft: false},
        rendered: {
          metadata: {
            imagePaths: ["./_assets/story.jpg"],
            frontmatter: {
              tripStoryFigures: [
                {path: "./_assets/story.jpg", alt: "A bicycle by the sea", caption: "Above the Atlantic."},
              ],
            },
          },
        },
      },
    ],
    {
      optimise: async (image, width) => `${image.src}?w=${width}`,
      pageUrl: path => `https://neilarmstrong.dev${path}`,
      resolveStoryImage: () => story,
    },
  );

  expect(pages).toEqual([
    {
      pageUrl: "https://neilarmstrong.dev/cycling/coast/headland-to-harbour/",
      images: [{url: "/story.jpg?w=800", title: "Above the Atlantic."}],
    },
  ]);
});

it("excludes draft chapters from the image sitemap", async () => {
  const pages = await buildTripChapterImageSitemapPages([{id: "coast/part-2-draft-chapter", data: {draft: true}}], {
    optimise: async image => image.src,
    pageUrl: path => path,
    resolveStoryImage: () => undefined,
  });

  expect(pages).toEqual([]);
});
