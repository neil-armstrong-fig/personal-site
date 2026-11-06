const META_REFRESH = /<meta\s+http-equiv="refresh"\s+content="\d+;\s*url=([^"]*)"/i;

/** The URL a redirect page sends the visitor to, or undefined for an ordinary page. */
export function redirectTargetOf(html: string): string | undefined {
  return META_REFRESH.exec(html)?.[1];
}
