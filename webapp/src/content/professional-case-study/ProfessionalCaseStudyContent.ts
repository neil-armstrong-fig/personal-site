import type {ImageMetadata} from "astro";
import type {SchemaContext} from "astro:content";
import {z} from "astro/zod";

interface ProfessionalCaseStudyDiagram {
  image: ImageMetadata;
  mobileImage: ImageMetadata;
  imageDark?: ImageMetadata;
  mobileImageDark?: ImageMetadata;
  alt: string;
}

interface ProfessionalCaseStudyContent {
  title: string;
  summary: string;
  careerPeriod: string;
  role?: string;
  team?: string;
  sortOrder: number;
  homepageOrder?: number;
  technologies: string[];
  draft: boolean;
  seoTitle?: string;
  seoDescription: string;
  diagram?: ProfessionalCaseStudyDiagram;
}

export function createProfessionalCaseStudyContentSchema({
  image,
}: SchemaContext): z.ZodType<ProfessionalCaseStudyContent, unknown> {
  const requiredText = z.string().trim().min(1);

  return z.object({
    title: requiredText,
    summary: requiredText,
    careerPeriod: requiredText,
    role: requiredText.optional(),
    team: requiredText.optional(),
    sortOrder: z.number().int().positive(),
    homepageOrder: z.number().int().positive().optional(),
    technologies: z.array(requiredText).min(1),
    draft: z.boolean(),
    seoTitle: requiredText.optional(),
    seoDescription: requiredText,
    diagram: z
      .object({
        image: image(),
        mobileImage: image(),
        imageDark: image().optional(),
        mobileImageDark: image().optional(),
        alt: requiredText,
      })
      .optional(),
  });
}
