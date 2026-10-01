type ExternalRel = string | null;

export function externalLinkRel(rel?: ExternalRel): string {
  return [rel, "noopener", "noreferrer"].filter(Boolean).join(" ");
}
