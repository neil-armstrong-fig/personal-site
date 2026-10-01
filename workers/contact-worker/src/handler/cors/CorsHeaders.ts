// Only the site's own origin may read the Worker's answers; any other origin gets no CORS headers at all.
export function corsHeaders(requestOrigin: string | undefined, allowedOrigin: string): Headers {
  const headers = new Headers();

  if (requestOrigin === allowedOrigin) {
    headers.set("Access-Control-Allow-Origin", allowedOrigin);
    headers.set("Vary", "Origin");
  }

  return headers;
}
