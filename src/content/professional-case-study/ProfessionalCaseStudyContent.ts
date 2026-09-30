import {z} from "astro/zod";

interface ProfessionalCaseStudyContent {
  title: string;
  summary: string;
  careerPeriod: string;
  sortOrder: number;
  homepageOrder?: number;
  technologies: string[];
  draft: boolean;
  seoTitle?: string;
  seoDescription: string;
}

export function createProfessionalCaseStudyContentSchema(): z.ZodType<ProfessionalCaseStudyContent, unknown> {
  const requiredText = z.string().trim().min(1);

  return z.object({
    title: requiredText,
    summary: requiredText,
    careerPeriod: requiredText,
    sortOrder: z.number().int().positive(),
    homepageOrder: z.number().int().positive().optional(),
    technologies: z.array(requiredText).min(1),
    draft: z.boolean(),
    seoTitle: requiredText.optional(),
    seoDescription: requiredText,
  });
}
