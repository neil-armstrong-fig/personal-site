import {getCollection} from "astro:content";
import type {CollectionEntry} from "astro:content";

import {sortProfessionalCaseStudies} from "@src/content/professional-case-study/professional-case-study-order/ProfessionalCaseStudyOrder";
import {isPublished} from "@src/content/shared/IsPublished";

export async function getPublishedProfessionalCaseStudies(): Promise<CollectionEntry<"professionalCaseStudies">[]> {
  return sortProfessionalCaseStudies((await getCollection("professionalCaseStudies")).filter(isPublished));
}
