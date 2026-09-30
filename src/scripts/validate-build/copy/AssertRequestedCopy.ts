import {assertContains} from "@src/scripts/validate-build/html/AssertContains";

type ExpectedCopyByRoute = Record<string, readonly string[]>;

export function assertRequestedCopy(html: string, route: string): void {
  const expectedByRoute: ExpectedCopyByRoute = {
    "/": [
      "I’m Neil Armstrong, a software architect in Belfast",
      "Systems I’ve delivered",
      "Projects built in the open",
      "Read Tokyo to Seoul",
      "Got a system nobody dares touch?",
    ],
    "/about/": ["<h1>About</h1>", "cross-functional teams", "domain-specific languages"],
    "/cycling/": ["Pedals instead of pull requests"],
    "/software/": [
      "What I have delivered",
      "Build it again, but better",
      "What sets me apart",
      "Tests are the specification",
    ],
  };

  for (const expected of expectedByRoute[route] ?? []) {
    assertContains(html, expected, route);
  }

  if (route === "/" && html.includes("Software with clear boundaries and lasting value")) {
    throw new Error(`${route} still contains the retired homepage heading.`);
  }

  if (route === "/software/build-it-again-better/" && html.includes('"@type":"SoftwareSourceCode"')) {
    throw new Error(`${route} must not claim SoftwareSourceCode structured data for professional work.`);
  }
}
