import path from "node:path";

export function routeForHtmlPath(htmlPath: string, buildDirectory: string): string {
  return (
    "/" +
    path
      .relative(buildDirectory, htmlPath)
      .split(path.sep)
      .join("/")
      .replace(/index\.html$/, "")
  );
}
