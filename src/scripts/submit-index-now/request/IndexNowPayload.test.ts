import {expect, it} from "vitest";

import {buildIndexNowPayload} from "./IndexNowPayload";

it("builds an IndexNow batch for the canonical host", () => {
  expect(
    buildIndexNowPayload({
      key: "0123456789abcdef0123456789abcdef",
      keyLocation: new URL("https://neilarmstrong.dev/indexnow-key.txt"),
      urls: ["https://neilarmstrong.dev/", "https://neilarmstrong.dev/software/"],
    }),
  ).toEqual({
    host: "neilarmstrong.dev",
    key: "0123456789abcdef0123456789abcdef",
    keyLocation: "https://neilarmstrong.dev/indexnow-key.txt",
    urlList: ["https://neilarmstrong.dev/", "https://neilarmstrong.dev/software/"],
  });
});
