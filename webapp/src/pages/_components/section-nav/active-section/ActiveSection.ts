export interface SectionPosition {
  id: string;
  /** Distance from the top of the viewport to the top of the section, negative once it has scrolled past. */
  top: number;
}

/**
 * The section the reader is in: the one nearest above the activation line, whatever order they are given in.
 * Undefined while every section is still below it (the hero, for instance).
 */
export function activeSectionId(sections: SectionPosition[], activationLine: number): string | undefined {
  let active: SectionPosition | undefined;

  for (const section of sections) {
    if (section.top > activationLine) {
      continue;
    }

    if (active === undefined || section.top > active.top) {
      active = section;
    }
  }

  return active?.id;
}
