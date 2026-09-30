import {absoluteUrl} from "@src/site/urls/AbsoluteUrl";

export const siteIdentifiers = {
  person: absoluteUrl("/#person"),
  webSite: absoluteUrl("/#website"),
} as const;
