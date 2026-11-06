interface CaseStudyHomepageData {
  homepageOrder?: number;
}

interface CaseStudyWithHomepageData {
  data: CaseStudyHomepageData;
}

export const HOMEPAGE_CASE_STUDY_LIMIT = 2;

export function selectHomepageCaseStudies<T extends CaseStudyWithHomepageData>(caseStudies: readonly T[]): T[] {
  return caseStudies
    .filter(caseStudy => caseStudy.data.homepageOrder !== undefined)
    .sort((first, second) => homepageOrder(first) - homepageOrder(second))
    .slice(0, HOMEPAGE_CASE_STUDY_LIMIT);
}

function homepageOrder(caseStudy: CaseStudyWithHomepageData): number {
  return caseStudy.data.homepageOrder ?? Number.MAX_SAFE_INTEGER;
}
