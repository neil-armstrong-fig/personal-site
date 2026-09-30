import {siteConfig} from "@src/site/SiteConfig";

export function absoluteUrl(pathOrUrl: string): string {
  return new URL(pathOrUrl, siteConfig.origin).href;
}
