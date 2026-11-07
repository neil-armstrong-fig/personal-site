import {expect, it} from "vitest";

import {deferTripImages} from "./DeferTripImages";

const image =
  '<img src="/bike.webp" srcset="/small.webp 480w, /bike.webp 1600w" width="1600" height="1200" alt="Bike &amp; bags" loading="lazy" sizes="100vw">';

it("reserves story image dimensions and retains responsive WebP sources and alt text in both fallbacks", () => {
  const html = deferTripImages(`<figure>${image}<figcaption>Ready.</figcaption></figure>`, true);

  expect(html).toContain("--trip-image-ratio:1600/1200");
  expect(html).toContain("<template>");
  expect(html).toContain("<noscript>");
  expect(html.match(/srcset="\/small.webp 480w, \/bike.webp 1600w"/g)).toHaveLength(2);
  expect(html.match(/alt="Bike &amp; bags"/g)).toHaveLength(2);
  expect(html).toContain('sizes="(min-width: 63rem) 60rem, calc(100vw - 3rem)"');
  expect(html).toContain("<figcaption>Ready.</figcaption>");
});

it("positions map fallbacks within their fixed shell without changing their sizes", () => {
  const html = deferTripImages(image, false);

  expect(html).toContain('class="absolute inset-0"');
  expect(html).not.toContain("--trip-image-ratio");
  expect(html).toContain('sizes="100vw"');
});

it("leaves videos and images without usable dimensions unchanged", () => {
  const html = '<video src="/clip.mp4" controls></video><img src="/unknown.webp" alt="Unknown">';

  expect(deferTripImages(html, true)).toBe(html);
});

it("handles greater-than characters inside quoted image attributes", () => {
  const html = deferTripImages(image.replace("Bike &amp; bags", "Bags > bike"), true);

  expect(html).toContain('alt="Bags > bike"');
  expect(html).toContain("</template><noscript><img");
});
