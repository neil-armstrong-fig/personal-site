import {expect, it} from "vitest";

import {buildFaqPageNode} from "./FaqPageNode";
import type {FaqEntry} from "@src/pages/about/_components/faq/types/FaqEntry";

const entries: readonly FaqEntry[] = [
  {question: "Where are you based?", answer: "Belfast, Northern Ireland."},
  {question: "Do you cycle?", answer: "Yes, on long solo trips."},
];

it("turns each entry into a question with its visible answer text", () => {
  expect(buildFaqPageNode({path: "/about/", entries})).toMatchObject({
    "@type": "FAQPage",
    url: "https://neilarmstrong.dev/about/",
    mainEntity: [
      {
        "@type": "Question",
        name: "Where are you based?",
        acceptedAnswer: {"@type": "Answer", text: "Belfast, Northern Ireland."},
      },
      {
        "@type": "Question",
        name: "Do you cycle?",
        acceptedAnswer: {"@type": "Answer", text: "Yes, on long solo trips."},
      },
    ],
  });
});

it("is part of the website in British English", () => {
  expect(buildFaqPageNode({path: "/about/", entries})).toMatchObject({
    inLanguage: "en-GB",
    isPartOf: {"@id": "https://neilarmstrong.dev/#website"},
  });
});
