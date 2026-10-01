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

interface ContactFormConfiguration {
  // The contact Worker, on its own Cloudflare custom domain because the apex is served by GitHub Pages.
  endpoint: string;
  // Public by design: the widget's site key. The matching secret lives only in the Worker.
  turnstileSiteKey: string;
}

interface SiteConfiguration {
  contactForm: ContactFormConfiguration;
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
  {label: "Contact", href: "/contact/"},
  {label: "Play Janggi", href: "https://janggi.neilarmstrong.dev/", external: true},
];

export const siteConfig = {
  contactForm: {
    endpoint: "https://contact.neilarmstrong.dev/",
    turnstileSiteKey: "0x4AAAAAAFKqAHuA_va64uY7",
  },
  description:
    "Neil Armstrong is a Belfast software architect who builds new products, transforms critical systems, and leads teams with readable tests and AI-native engineering. He also cycles long trips.",
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
