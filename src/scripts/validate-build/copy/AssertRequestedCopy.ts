import {assertContains} from "@src/scripts/validate-build/html/AssertContains";

type ExpectedCopyByRoute = Record<string, readonly string[]>;

export function assertRequestedCopy(html: string, route: string): void {
  const expectedByRoute: ExpectedCopyByRoute = {
    "/": [
      "I’m Neil Armstrong, a software architect in Belfast",
      "Products and systems I’ve delivered",
      "Reinventing audio installation software",
      "A serverless insurance platform",
      "Build it again, but better",
      "Projects built in the open",
      "Read Tokyo to Seoul",
      "Building something new, or changing something difficult?",
    ],
    "/about/": ["<h1>About Neil Armstrong</h1>", "cross-functional teams", "domain-specific languages"],
    "/cycling/": ["Pedals instead of pull requests"],
    "/software/": [
      "Software architecture and engineering",
      "I’m Neil Armstrong, a Belfast software architect and developer",
      "What I have delivered",
      "Build it again, but better",
      "What sets me apart",
      "Make the idea real early",
      "Tests enable change",
      '"@type":"CollectionPage"',
    ],
  };

  for (const expected of expectedByRoute[route] ?? []) {
    assertContains(html, expected, route);
  }

  if (route === "/" && html.includes("Software with clear boundaries and lasting value")) {
    throw new Error(`${route} still contains the retired homepage heading.`);
  }

  if (route === "/" && html.includes("Got a system nobody dares touch?")) {
    throw new Error(`${route} still contains the legacy-only conversation heading.`);
  }

  if (route === "/software/build-it-again-better/" && html.includes('"@type":"SoftwareSourceCode"')) {
    throw new Error(`${route} must not claim SoftwareSourceCode structured data for professional work.`);
  }

  if (route === "/software/build-it-again-better/" && !html.includes('"@type":"Article"')) {
    throw new Error(`${route} must describe professional work as an Article.`);
  }
}
