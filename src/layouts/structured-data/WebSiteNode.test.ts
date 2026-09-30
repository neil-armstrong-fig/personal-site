import {expect, it} from "vitest";

import {buildWebSiteNode} from "./WebSiteNode";
import {siteIdentifiers} from "@src/site/structured-data/SiteIdentifiers";

it("describes the website without a search action", () => {
  const node = buildWebSiteNode();

  expect(node).toMatchObject({"@type": "WebSite", "@id": siteIdentifiers.webSite, url: "https://neilarmstrong.dev/"});
  expect(node).not.toHaveProperty("potentialAction");
});
