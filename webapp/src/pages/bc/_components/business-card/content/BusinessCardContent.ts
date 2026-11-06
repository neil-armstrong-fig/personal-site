import {siteConfig} from "@src/site/SiteConfig";

interface CardLink {
  label: string;
  href: string;
}

interface CardSection {
  heading: string;
  lines: readonly string[];
}

interface BusinessCardContent {
  name: string;
  title: string;
  location: string;
  portraitAlt: string;
  links: readonly CardLink[];
  sections: readonly CardSection[];
  cycling: string;
}

const siteHost = new URL(siteConfig.origin).host;

/**
 * The card is a short version of what the site already says, so each line below traces to published copy. The back is
 * written as fragments, the way a printed card is, because it has to stay legible at the size of one.
 */
export const businessCardContent: BusinessCardContent = {
  name: siteConfig.identity.name,
  title: siteConfig.identity.publicTitle,
  location: siteConfig.identity.location,
  portraitAlt: `${siteConfig.identity.name}, a software architect and developer in Belfast`,
  links: [
    {label: siteConfig.socialLinks.linkedIn.label, href: siteConfig.socialLinks.linkedIn.href},
    {label: siteConfig.socialLinks.github.label, href: siteConfig.socialLinks.github.href},
    {label: siteHost, href: siteConfig.origin},
  ],
  sections: [
    {
      // About, key facts: "Working in software since" 2011, "Tech and engineering lead".
      heading: "Experience",
      lines: ["In software since 2011", "Tech and engineering lead"],
    },
    {
      // About, key facts: "New products taken to production quickly, legacy migration, upskilling and modernisation".
      heading: "Focus",
      lines: ["New product delivery", "Legacy modernisation"],
    },
    {
      // About, how I work: readable acceptance tests, and AI-native practices with a person accountable.
      heading: "Ways of working",
      lines: ["Readable acceptance tests", "AI-native, with a person accountable"],
    },
    {
      // About, key facts: the stack line.
      heading: "Stack",
      lines: ["TypeScript, React, Node.js", "Kotlin, C#, Java, AWS"],
    },
  ],
  // About, key facts: "long-distance solo cycling".
  cycling: "Long-distance solo cyclist",
};
