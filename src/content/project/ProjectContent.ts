import type {ImageMetadata} from "astro";
import type {SchemaContext} from "astro:content";
import {z} from "astro/zod";

interface ProjectContent {
  title: string;
  summary: string;
  datePublished: Date;
  dateModified?: Date;
  technologies: string[];
  repositoryUrl: URL;
  liveUrl?: URL;
  liveLabel?: string;
  heroImage: ImageMetadata;
  heroAlt: string;
  featured: boolean;
  draft: boolean;
  seoTitle?: string;
  seoDescription: string;
}

export function createProjectContentSchema({image}: SchemaContext): z.ZodType<ProjectContent, unknown> {
  const requiredText = z.string().trim().min(1);
  const webUrl = z.url({protocol: /^https?$/}).transform(value => new URL(value));

  return z.object({
    title: requiredText,
    summary: requiredText,
    datePublished: z.coerce.date(),
    dateModified: z.coerce.date().optional(),
    technologies: z.array(requiredText).min(1),
    repositoryUrl: webUrl,
    liveUrl: webUrl.optional(),
    liveLabel: requiredText.optional(),
    heroImage: image(),
    heroAlt: requiredText,
    featured: z.boolean(),
    draft: z.boolean(),
    seoTitle: requiredText.optional(),
    seoDescription: requiredText,
  });
}
