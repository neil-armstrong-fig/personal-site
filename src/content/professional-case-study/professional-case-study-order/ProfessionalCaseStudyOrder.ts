interface ProfessionalCaseStudyOrder {
  sortOrder: number;
}

interface ProfessionalCaseStudyWithOrder {
  data: ProfessionalCaseStudyOrder;
}

export function sortProfessionalCaseStudies<T extends ProfessionalCaseStudyWithOrder>(caseStudies: readonly T[]): T[] {
  return [...caseStudies].sort((first, second) => first.data.sortOrder - second.data.sortOrder);
}
