interface IndexNowPayloadOptions {
  key: string;
  keyLocation: URL;
  urls: readonly string[];
}

interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

export function buildIndexNowPayload({key, keyLocation, urls}: IndexNowPayloadOptions): IndexNowPayload {
  return {
    host: keyLocation.host,
    key,
    keyLocation: keyLocation.href,
    urlList: [...urls],
  };
}
