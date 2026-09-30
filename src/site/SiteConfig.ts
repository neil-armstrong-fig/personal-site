interface NavigationItem {
  href: string;
  label: string;
  // A different site opened in a new tab, styled to stand out from the section links.
  external?: boolean;
}

interface SocialLink {
  href: string;
  label: string;
}

interface SiteIdentity {
  location: string;
  name: string;
  publicTitle: string;
}

interface SiteSocialLinks {
  github: SocialLink;
  instagram: SocialLink;
  linkedIn: SocialLink;
  strava: SocialLink;
}

interface SiteConfiguration {
  description: string;
  identity: SiteIdentity;
  navigation: readonly NavigationItem[];
  origin: string;
  socialLinks: SiteSocialLinks;
  title: string;
}

const navigation: readonly NavigationItem[] = [
  {label: "Home", href: "/"},
  {label: "Software", href: "/software/"},
  {label: "Cycling", href: "/cycling/"},
  {label: "About", href: "/about/"},
  {label: "Play Janggi", href: "https://janggi.neilarmstrong.dev/", external: true},
];

export const siteConfig = {
  description:
    "Neil Armstrong is a software architect in Belfast who rebuilds critical systems without regressions, using acceptance-test-driven delivery, AWS serverless, and TypeScript. He also cycles long trips.",
  identity: {
    location: "Belfast, Northern Ireland",
    name: "Neil Armstrong",
    publicTitle: "Software architect and developer",
  },
  navigation,
  origin: "https://neilarmstrong.dev",
  socialLinks: {
    linkedIn: {label: "LinkedIn", href: "https://www.linkedin.com/in/neil-armstrong-dev/"},
    github: {label: "GitHub", href: "https://github.com/neil-armstrong-fig"},
    strava: {label: "Strava", href: "https://www.strava.com/athletes/105635309"},
    instagram: {label: "Instagram", href: "https://www.instagram.com/neil_armstrong_slf/"},
  },
  title: "Neil Armstrong | Software Architect & Developer in Belfast",
} as const satisfies SiteConfiguration;
