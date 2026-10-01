type ExternalHref = string | URL | null | undefined;

export function isExternalHref(href: ExternalHref): boolean {
  return /^https?:\/\//.test(String(href ?? ""));
}
