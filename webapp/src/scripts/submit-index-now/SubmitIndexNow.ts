import {readFile} from "node:fs/promises";

import {buildIndexNowPayload} from "@src/scripts/submit-index-now/request/IndexNowPayload";
import {extractIndexNowUrls} from "@src/scripts/submit-index-now/sitemap/IndexNowUrls";
import {siteConfig} from "@src/site/SiteConfig";

const ROOT = process.cwd();
const KEY_FILE_NAME = "indexnow-key.txt";
const INDEX_NOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_ATTEMPTS = 3;

await submitIndexNow();

async function submitIndexNow(): Promise<void> {
  const key = (await readFile(`${ROOT}/public/${KEY_FILE_NAME}`, "utf8")).trim();

  if (!/^[a-f0-9]{32}$/.test(key)) {
    throw new Error(`${KEY_FILE_NAME} must contain one 32-character lowercase hexadecimal key.`);
  }

  const origin = new URL(siteConfig.origin);
  const sitemapUrl = new URL("/sitemap-0.xml", origin);
  sitemapUrl.searchParams.set("indexnow", Date.now().toString());

  const sitemapResponse = await fetchWithRetries(sitemapUrl, {cache: "no-store"});
  const urlList = extractIndexNowUrls(await sitemapResponse.text(), origin.origin);
  const payload = buildIndexNowPayload({
    key,
    keyLocation: new URL(`/${KEY_FILE_NAME}`, origin),
    urls: urlList,
  });

  await fetchWithRetries(INDEX_NOW_ENDPOINT, {
    method: "POST",
    headers: {"content-type": "application/json; charset=utf-8"},
    body: JSON.stringify(payload),
  });

  process.stdout.write(`Submitted ${urlList.length} canonical URLs to IndexNow.\n`);
}

async function fetchWithRetries(url: URL | string, init: RequestInit): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url, init);

      if (response.ok) {
        return response;
      }

      lastError = new Error(`Request to ${new URL(url).origin} failed with HTTP ${response.status}.`);
    } catch (error) {
      lastError = error;
    }

    if (attempt < MAX_ATTEMPTS) {
      await delay(attempt * 1_000);
    }
  }

  throw lastError;
}

async function delay(milliseconds: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, milliseconds));
}
