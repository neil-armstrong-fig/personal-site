interface CaseStudyHomepageData {
  homepageOrder?: number;
}

interface CaseStudyWithHomepageData {
  data: CaseStudyHomepageData;
}

export function selectHomepageCaseStudies<T extends CaseStudyWithHomepageData>(caseStudies: readonly T[]): T[] {
  return caseStudies
    .filter(caseStudy => caseStudy.data.homepageOrder !== undefined)
    .sort((first, second) => homepageOrder(first) - homepageOrder(second));
}

function homepageOrder(caseStudy: CaseStudyWithHomepageData): number {
  return caseStudy.data.homepageOrder ?? Number.MAX_SAFE_INTEGER;
}
