import {expect, it} from "vitest";

import {buildProfilePageNode} from "./ProfilePageNode";
import {siteIdentifiers} from "@src/site/structured-data/SiteIdentifiers";

it("makes the person the main entity of the profile page", () => {
  expect(buildProfilePageNode({path: "/about/", description: "About Neil."})).toMatchObject({
    "@type": "ProfilePage",
    url: "https://neilarmstrong.dev/about/",
    mainEntity: {"@id": siteIdentifiers.person},
  });
});
