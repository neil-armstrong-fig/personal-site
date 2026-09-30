interface RenderedTripContent {
  metadata?: unknown;
}

interface TripWithStoryFigures {
  id: string;
  rendered?: RenderedTripContent;
}

interface TripStoryFigure {
  path: string;
  alt: string;
  caption: string;
}

export function getTripStoryFigures(trip: TripWithStoryFigures): readonly TripStoryFigure[] {
  const value = storyFiguresValue(trip.rendered?.metadata);

  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value) || !value.every(isTripStoryFigure)) {
    throw new Error(`${trip.id}: invalid trip story figure metadata.`);
  }

  return value;
}

function storyFiguresValue(metadata: unknown): unknown {
  if (typeof metadata !== "object" || metadata === null) {
    return undefined;
  }

  const frontmatter = (metadata as Record<string, unknown>)["frontmatter"];

  if (typeof frontmatter !== "object" || frontmatter === null) {
    return undefined;
  }

  return (frontmatter as Record<string, unknown>)["tripStoryFigures"];
}

function isTripStoryFigure(value: unknown): value is TripStoryFigure {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate["path"] === "string" &&
    typeof candidate["alt"] === "string" &&
    typeof candidate["caption"] === "string"
  );
}
