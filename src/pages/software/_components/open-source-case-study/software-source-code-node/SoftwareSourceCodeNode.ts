import {absoluteUrl} from "@src/site/urls/AbsoluteUrl";
import {formatIsoDate} from "@src/site/structured-data/dates/IsoDate";
import {siteIdentifiers} from "@src/site/structured-data/SiteIdentifiers";
import type {JsonLdNode} from "@src/site/structured-data/types/JsonLdNode";

type OptionalDate = Date | undefined;

interface SoftwareSourceCodeOptions {
  name: string;
  description: string;
  path: string;
  repositoryUrl: URL;
  technologies: readonly string[];
  datePublished: Date;
  dateModified: OptionalDate;
}

export function buildSoftwareSourceCodeNode(options: SoftwareSourceCodeOptions): JsonLdNode {
  const {name, description, path, repositoryUrl, technologies, datePublished, dateModified} = options;

  const node: JsonLdNode = {
    "@type": "SoftwareSourceCode",
    name,
    description,
    url: absoluteUrl(path),
    codeRepository: repositoryUrl.href,
    keywords: [...technologies],
    author: {"@id": siteIdentifiers.person},
    datePublished: formatIsoDate(datePublished),
  };

  if (dateModified !== undefined) {
    node["dateModified"] = formatIsoDate(dateModified);
  }

  return node;
}
