import {absoluteUrl} from "@src/site/urls/AbsoluteUrl";
import {siteIdentifiers} from "@src/site/structured-data/SiteIdentifiers";
import type {FaqEntry} from "@src/pages/about/_components/faq/types/FaqEntry";
import type {JsonLdNode} from "@src/site/structured-data/types/JsonLdNode";

interface FaqPageOptions {
  path: string;
  entries: readonly FaqEntry[];
}

export function buildFaqPageNode({path, entries}: FaqPageOptions): JsonLdNode {
  return {
    "@type": "FAQPage",
    url: absoluteUrl(path),
    inLanguage: "en-GB",
    isPartOf: {"@id": siteIdentifiers.webSite},
    mainEntity: entries.map(buildQuestionNode),
  };
}

function buildQuestionNode({question, answer}: FaqEntry): JsonLdNode {
  return {
    "@type": "Question",
    name: question,
    acceptedAnswer: {"@type": "Answer", text: answer},
  };
}
