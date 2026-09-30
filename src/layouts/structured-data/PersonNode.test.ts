import {expect, it} from "vitest";

import {buildPersonNode} from "./PersonNode";
import {siteIdentifiers} from "@src/site/structured-data/SiteIdentifiers";

it("links the person to every social profile through sameAs", () => {
  const node = buildPersonNode();

  expect(node).toMatchObject({"@type": "Person", "@id": siteIdentifiers.person, name: "Neil Armstrong"});
  expect(node["sameAs"]).toEqual([
    "https://www.linkedin.com/in/neil-armstrong-dev/",
    "https://github.com/neil-armstrong-fig",
    "https://www.strava.com/athletes/105635309",
    "https://www.instagram.com/neil_armstrong_slf/",
  ]);
});
