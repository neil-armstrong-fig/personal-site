import type {APIRoute} from "astro";

import {getPublishedProfessionalCaseStudies} from "@src/content/professional-case-study/GetPublishedProfessionalCaseStudies";
import {getPublishedProjects} from "@src/content/project/GetPublishedProjects";
import {buildLlmsText} from "@src/pages/_components/llms-text/LlmsText";
import {siteConfig} from "@src/site/SiteConfig";

export const GET: APIRoute = async () => {
  const [caseStudies, projects] = await Promise.all([getPublishedProfessionalCaseStudies(), getPublishedProjects()]);

  const text = buildLlmsText({
    name: siteConfig.identity.name,
    description: siteConfig.description,
    caseStudies: caseStudies.map(({id, data}) => ({
      title: data.title,
      summary: data.summary,
      path: `/software/${id}/`,
    })),
    projects: projects.map(({id, data}) => ({title: data.title, summary: data.summary, path: `/software/${id}/`})),
    profiles: Object.values(siteConfig.socialLinks),
  });

  return new Response(text, {headers: {"Content-Type": "text/plain; charset=utf-8"}});
};
