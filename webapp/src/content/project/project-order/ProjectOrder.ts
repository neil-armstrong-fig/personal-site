interface ProjectOrder {
  sortOrder: number;
}

interface ProjectWithOrder {
  data: ProjectOrder;
}

export function sortProjects<T extends ProjectWithOrder>(projects: readonly T[]): T[] {
  return [...projects].sort((first, second) => first.data.sortOrder - second.data.sortOrder);
}
