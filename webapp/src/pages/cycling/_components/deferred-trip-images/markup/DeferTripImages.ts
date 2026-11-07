type OptionalDimension = number | undefined;

// This consumes Astro-rendered image tags, not arbitrary HTML. Keep each tag intact so Astro's optimised
// sources, dimensions and escaped alt text survive in both the inert template and the native fallback.
export function deferTripImages(html: string, story: boolean): string {
  return html.replace(/<img\b(?:[^>"']|"[^"]*"|'[^']*')*>/g, image => {
    const width = dimension(image, "width");
    const height = dimension(image, "height");

    if (width === undefined || height === undefined) {
      return image;
    }

    let attributes = 'class="absolute inset-0"';

    if (story) {
      attributes = `class="block w-full aspect-(--trip-image-ratio)" style="--trip-image-ratio:${width}/${height}"`;
      image = image.replace(/\ssizes="[^"]*"/, ' sizes="(min-width: 63rem) 60rem, calc(100vw - 3rem)"');
    }

    return `<div data-deferred-trip-image ${attributes}><template>${image}</template><noscript>${image}</noscript></div>`;
  });
}

function dimension(image: string, name: string): OptionalDimension {
  const match = new RegExp(`\\s${name}="([0-9]+)"`).exec(image);
  const value = Number(match?.[1]);

  if (!Number.isFinite(value) || value <= 0) {
    return undefined;
  }

  return value;
}
