import {isTripVideoPath} from "@src/content/trip/trip-figures/video/IsTripVideoPath";
import {tripVideoNode} from "@src/content/trip/trip-figures/video/TripVideoNode";

type NullableText = string | null;
type OptionalUrl = URL | undefined;

interface MarkdownImage extends MarkdownNode {
  type: "image";
  url: string;
  alt?: NullableText;
  title?: NullableText;
}

interface MarkdownParagraph {
  type: "paragraph";
  children: MarkdownNode[];
}

interface MarkdownNode {
  type: string;
  children?: MarkdownNode[];
  data?: Record<string, unknown>;
  value?: string;
  url?: string;
  alt?: NullableText;
  title?: NullableText;
}

interface TripFigureContext {
  fileURL?: URL;
  data: Record<string, unknown>;
  replaceNode: (node: MarkdownParagraph, replacement: MarkdownNode) => void;
}

interface TripFigurePlugin {
  name: string;
  before: (root: MarkdownNode, context: TripFigureContext) => void;
  paragraph: (node: MarkdownParagraph, context: TripFigureContext) => void;
}

interface TripStoryFigure {
  path: string;
  alt: string;
  caption: string;
}

interface AstroMarkdownData {
  frontmatter: Record<string, unknown>;
}

const TRIP_PATH = /\/src\/content\/trip\/entries\/[^/]+\/[^/]+\.mdx?$/;
const METADATA_KEY = "tripStoryFigures";

export function tripFigures(): TripFigurePlugin {
  return {
    name: "trip-figures",
    before: (_root, context) => {
      if (isTrip(context.fileURL)) {
        astroData(context).frontmatter[METADATA_KEY] = [];
      }
    },
    paragraph: (paragraph, context) => {
      if (!isTrip(context.fileURL)) {
        return;
      }

      const images = paragraph.children.filter(isImage);

      if (images.length === 0) {
        return;
      }

      if (paragraph.children.length !== 1 || images.length !== 1) {
        throw new Error(`${context.fileURL?.pathname}: trip story images must be authored on their own line.`);
      }

      const [image] = images;

      if (image === undefined) {
        return;
      }

      const path = image.url.trim();
      const alt = image.alt?.trim();
      const caption = image.title?.trim();

      if (path === "") {
        throw new Error(`${context.fileURL?.pathname}: trip story image path must not be blank.`);
      }

      if (alt === undefined || alt === "") {
        throw new Error(`${context.fileURL?.pathname}: trip story image alt text must not be blank.`);
      }

      if (caption === undefined || caption === "") {
        throw new Error(`${context.fileURL?.pathname}: trip story image caption must not be blank.`);
      }

      let media: MarkdownNode = {...image, title: null};

      if (isTripVideoPath(path)) {
        media = tripVideoNode({path, alt});
      } else {
        figureMetadata(context).push({path, alt, caption});
      }

      context.replaceNode(paragraph, {
        type: "tripFigure",
        data: {hName: "figure"},
        children: [
          media,
          {
            type: "tripCaption",
            data: {hName: "figcaption"},
            children: [{type: "text", value: caption}],
          },
        ],
      });
    },
  };
}

function isImage(node: MarkdownNode): node is MarkdownImage {
  return node.type === "image" && "url" in node && typeof node.url === "string";
}

function isTrip(fileURL: OptionalUrl): boolean {
  return fileURL !== undefined && TRIP_PATH.test(fileURL.pathname.replaceAll("\\", "/"));
}

function astroData(context: TripFigureContext): AstroMarkdownData {
  const data = context.data["astro"];

  if (typeof data !== "object" || data === null || !("frontmatter" in data)) {
    throw new Error("Astro Markdown data is unavailable to the trip figure processor.");
  }

  return data as AstroMarkdownData;
}

function figureMetadata(context: TripFigureContext): TripStoryFigure[] {
  const value = astroData(context).frontmatter[METADATA_KEY];

  if (!Array.isArray(value)) {
    throw new Error("Trip figure metadata was not initialised.");
  }

  return value as TripStoryFigure[];
}
