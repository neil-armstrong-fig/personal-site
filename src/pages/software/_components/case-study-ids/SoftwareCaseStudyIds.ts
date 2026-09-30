export function assertUniqueSoftwareCaseStudyIds(
  projectIds: readonly string[],
  professionalCaseStudyIds: readonly string[],
): void {
  const projectIdSet = new Set(projectIds);
  const duplicate = professionalCaseStudyIds.find(id => projectIdSet.has(id));

  if (duplicate !== undefined) {
    throw new Error(`Software case-study slug is used by both collections: ${duplicate}`);
  }
}
