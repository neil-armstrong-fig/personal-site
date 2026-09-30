import {expect, it, vi} from "vitest";

import {tripVideoNode} from "@src/content/trip/trip-figures/video/TripVideoNode";

import {tripFigures} from "./TripFigures";

it("turns a titled trip image into a semantic figure and records its sitemap metadata", () => {
  const plugin = tripFigures();
  const frontmatter: Record<string, unknown> = {};
  const replaceNode = vi.fn();
  const context = {
    fileURL: new URL("file:///site/src/content/trip/entries/porto-to-faro/index.md"),
    data: {astro: {frontmatter}},
    replaceNode,
  };
  const paragraph = {
    type: "paragraph" as const,
    children: [
      {
        type: "image",
        url: "./_assets/coast.jpg",
        alt: "A bicycle above the coast",
        title: "The road above the Atlantic.",
      },
    ],
  };

  plugin.before({type: "root"}, context);
  plugin.paragraph(paragraph, context);

  expect(replaceNode).toHaveBeenCalledWith(paragraph, {
    type: "tripFigure",
    data: {hName: "figure"},
    children: [
      {type: "image", url: "./_assets/coast.jpg", alt: "A bicycle above the coast", title: null},
      {
        type: "tripCaption",
        data: {hName: "figcaption"},
        children: [{type: "text", value: "The road above the Atlantic."}],
      },
    ],
  });
  expect(frontmatter).toEqual({
    tripStoryFigures: [
      {
        path: "./_assets/coast.jpg",
        alt: "A bicycle above the coast",
        caption: "The road above the Atlantic.",
      },
    ],
  });
});

it("turns a titled MP4 into a figure holding a video, without recording it as a sitemap image", () => {
  const plugin = tripFigures();
  const frontmatter: Record<string, unknown> = {};
  const replaceNode = vi.fn();
  const context = {
    fileURL: new URL("file:///site/src/content/trip/entries/porto-to-faro/index.md"),
    data: {astro: {frontmatter}},
    replaceNode,
  };
  const paragraph = {
    type: "paragraph" as const,
    children: [
      {type: "image", url: "/trips/porto-to-faro/coast.mp4", alt: "Riding the coast", title: "The coast road."},
    ],
  };

  plugin.before({type: "root"}, context);
  plugin.paragraph(paragraph, context);

  expect(replaceNode).toHaveBeenCalledWith(paragraph, {
    type: "tripFigure",
    data: {hName: "figure"},
    children: [
      tripVideoNode({path: "/trips/porto-to-faro/coast.mp4", alt: "Riding the coast"}),
      {
        type: "tripCaption",
        data: {hName: "figcaption"},
        children: [{type: "text", value: "The coast road."}],
      },
    ],
  });
  expect(frontmatter).toEqual({tripStoryFigures: []});
});

it("rejects a video without a caption", () => {
  const plugin = tripFigures();
  const context = {
    fileURL: new URL("file:///site/src/content/trip/entries/porto-to-faro/index.md"),
    data: {astro: {frontmatter: {}}},
    replaceNode: vi.fn(),
  };
  plugin.before({type: "root"}, context);

  expect(() =>
    plugin.paragraph(
      {
        type: "paragraph",
        children: [{type: "image", url: "/trips/porto-to-faro/coast.mp4", alt: "Coast", title: null}],
      },
      context,
    ),
  ).toThrow(/caption/);
});

it("treats a sibling Markdown file in a trip entry folder as trip content too", () => {
  const plugin = tripFigures();
  const frontmatter: Record<string, unknown> = {};
  const replaceNode = vi.fn();
  const context = {
    fileURL: new URL("file:///site/src/content/trip/entries/porto-to-faro/narrative.md"),
    data: {astro: {frontmatter}},
    replaceNode,
  };
  const paragraph = {
    type: "paragraph" as const,
    children: [
      {type: "image", url: "./_assets/coast.jpg", alt: "A bicycle above the coast", title: "The Atlantic road."},
    ],
  };

  plugin.before({type: "root"}, context);
  plugin.paragraph(paragraph, context);

  expect(replaceNode).toHaveBeenCalled();
});

it("leaves non-trip Markdown unchanged", () => {
  const plugin = tripFigures();
  const replaceNode = vi.fn();
  const context = {
    fileURL: new URL("file:///site/src/content/project/entries/example/index.md"),
    data: {astro: {frontmatter: {}}},
    replaceNode,
  };

  plugin.before({type: "root"}, context);
  plugin.paragraph(
    {type: "paragraph", children: [{type: "image", url: "./diagram.png", alt: "Architecture", title: null}]},
    context,
  );

  expect(replaceNode).not.toHaveBeenCalled();
});

it.each([
  {alt: "", title: "A caption", expected: "alt text"},
  {alt: "A road", title: " ", expected: "caption"},
  {alt: "A road", title: null, expected: "caption"},
])("rejects a trip story image with blank $expected", ({alt, title, expected}) => {
  const plugin = tripFigures();
  const context = {
    fileURL: new URL("file:///site/src/content/trip/entries/example/index.md"),
    data: {astro: {frontmatter: {}}},
    replaceNode: vi.fn(),
  };
  const paragraph = {
    type: "paragraph" as const,
    children: [{type: "image", url: "./_assets/road.jpg", alt, title}],
  };

  plugin.before({type: "root"}, context);

  expect(() => plugin.paragraph(paragraph, context)).toThrow(expected);
});
