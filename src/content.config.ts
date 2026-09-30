import {defineCollection} from "astro:content";
import {glob} from "astro/loaders";

import {createProjectContentSchema} from "@src/content/project/ProjectContent";
import {createProfessionalCaseStudyContentSchema} from "@src/content/professional-case-study/ProfessionalCaseStudyContent";
import {createTripContentSchema} from "@src/content/trip/TripContent";
import {createTripChapterContentSchema} from "@src/content/trip/trip-chapter/TripChapterContent";

const projects = defineCollection({
  loader: glob({base: "./src/content/project/entries", pattern: "**/*.{md,mdx}"}),
  schema: createProjectContentSchema,
});

const professionalCaseStudies = defineCollection({
  loader: glob({base: "./src/content/professional-case-study/entries", pattern: "**/*.{md,mdx}"}),
  schema: createProfessionalCaseStudyContentSchema,
});

const trips = defineCollection({
  loader: glob({base: "./src/content/trip/entries", pattern: "*/index.{md,mdx}"}),
  schema: createTripContentSchema,
});

const tripChapters = defineCollection({
  loader: glob({base: "./src/content/trip/entries", pattern: "*/part-*.{md,mdx}"}),
  schema: createTripChapterContentSchema,
});

export const collections = {professionalCaseStudies, projects, trips, tripChapters};
