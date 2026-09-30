export function isTripVideoPath(path: string): boolean {
  return path.startsWith("/") && /\.mp4$/i.test(path);
}
