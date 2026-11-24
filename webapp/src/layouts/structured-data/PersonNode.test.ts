import {expect, it} from "vitest";

import {buildPersonNode} from "./PersonNode";
import {siteIdentifiers} from "@src/site/structured-data/SiteIdentifiers";

it("describes and disambiguates the person", () => {
  const node = buildPersonNode();

  expect(node).toMatchObject({
    "@type": "Person",
    "@id": siteIdentifiers.person,
    name: "Neil Armstrong",
    jobTitle: "Software architect and developer",
    homeLocation: {"@type": "Place", name: "Belfast, Northern Ireland"},
    alumniOf: [
      {"@type": "CollegeOrUniversity", name: "Ulster University"},
      {"@type": "Organization", name: "Instil Software", sameAs: "https://www.linkedin.com/company/instilhq"},
    ],
    image: expect.stringMatching(/^https:\/\/neilarmstrong\.dev\//),
  });
  expect(node["sameAs"]).toEqual([
    "https://www.linkedin.com/in/neil-armstrong-dev/",
    "https://github.com/neil-armstrong-fig",
    "https://www.strava.com/athletes/105635309",
    "https://www.instagram.com/neil_armstrong_slf/",
  ]);
});
