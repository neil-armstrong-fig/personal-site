interface CompactCardImageSizing {
  widths: number[];
  sizes: string;
}

/**
 * Image sizing for a compact card in a `CardRail`: about two thirds of the viewport in the phone rail, 45vw in the
 * two-column grid and at most 32rem in the wide grid (the homepage's two-up cards are the largest). Sizing these
 * like a full-width card made a phone fetch the 800px file for a 250px image, and with the whole page inside the
 * browser's lazy-load distance that put about 400 KB ahead of the first paint.
 */
export const COMPACT_CARD_IMAGE: CompactCardImageSizing = {
  widths: [320, 480, 640, 800],
  sizes: "(min-width: 64rem) 32rem, (min-width: 48rem) 45vw, 65vw",
};
