import {expect, it} from "vitest";

import {siteIdentifiers} from "./SiteIdentifiers";

it("uses stable, absolute identifiers for the person and the website", () => {
  expect(siteIdentifiers.person).toBe("https://neilarmstrong.dev/#person");
  expect(siteIdentifiers.webSite).toBe("https://neilarmstrong.dev/#website");
});
