import type {ImageMetadata} from "astro";
import type {SchemaContext} from "astro:content";
import {z} from "astro/zod";

interface BlogPostDiagram {
  image: ImageMetadata;
  mobileImage: ImageMetadata;
  imageDark?: ImageMetadata;
  mobileImageDark?: ImageMetadata;
  alt: string;
}

interface BlogPostContent {
  title: string;
  summary: string;
  datePublished: Date;
  dateModified?: Date;
  topics: string[];
  homepageOrder?: number;
  draft: boolean;
  seoTitle?: string;
  seoDescription: string;
  diagram?: BlogPostDiagram;
}

export function createBlogPostContentSchema({image}: SchemaContext): z.ZodType<BlogPostContent, unknown> {
  const requiredText = z.string().trim().min(1);

  return z
    .object({
      title: requiredText,
      summary: requiredText,
      datePublished: z.coerce.date(),
      dateModified: z.coerce.date().optional(),
      topics: z.array(requiredText).min(1),
      homepageOrder: z.number().int().positive().optional(),
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
    })
    .refine(post => post.dateModified === undefined || post.dateModified >= post.datePublished, {
      message: "Modified date must be on or after the published date.",
      path: ["dateModified"],
    });
}
