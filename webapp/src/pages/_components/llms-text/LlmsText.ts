import {absoluteUrl} from "@src/site/urls/AbsoluteUrl";
import type {LlmsLink} from "@src/pages/_components/llms-text/types/LlmsLink";
import type {LlmsProfile} from "@src/pages/_components/llms-text/types/LlmsProfile";
import type {LlmsTextOptions} from "@src/pages/_components/llms-text/types/LlmsTextOptions";

const keyPages: readonly LlmsLink[] = [
  {title: "About", summary: "", path: "/about/"},
  {title: "Software", summary: "", path: "/software/"},
  {title: "Cycling", summary: "", path: "/cycling/"},
  {title: "Contact", summary: "", path: "/contact/"},
];

export function buildLlmsText({
  name,
  description,
  caseStudies,
  projects,
  blogPosts,
  profiles,
}: LlmsTextOptions): string {
  const sections = [
    `# ${name}\n\n> ${description}`,
    buildSection("Key pages", keyPages.map(buildPageLine)),
    buildSection("Professional work", caseStudies.map(buildSummaryLine)),
    buildSection("Open-source projects", projects.map(buildSummaryLine)),
    ...buildBlogSections(blogPosts),
    buildSection("Profiles", profiles.map(buildProfileLine)),
  ];

  return `${sections.join("\n\n")}\n`;
}

/** The blog section is left out entirely while no post is published, so the file never lists an empty heading. */
function buildBlogSections(blogPosts: readonly LlmsLink[]): string[] {
  if (blogPosts.length === 0) {
    return [];
  }

  return [buildSection("Blog", blogPosts.map(buildSummaryLine))];
}

function buildSection(heading: string, lines: readonly string[]): string {
  return `## ${heading}\n\n${lines.join("\n")}`;
}

function buildPageLine({title, path}: LlmsLink): string {
  return `- [${title}](${absoluteUrl(path)})`;
}

function buildSummaryLine({title, summary, path}: LlmsLink): string {
  return `- [${title}](${absoluteUrl(path)}): ${summary}`;
}

function buildProfileLine({label, href}: LlmsProfile): string {
  return `- [${label}](${href})`;
}
