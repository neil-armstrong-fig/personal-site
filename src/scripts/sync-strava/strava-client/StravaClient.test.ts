import {expect, it} from "vitest";

import {fetchAllActivities} from "./StravaClient.ts";

const credentials = {clientId: "id", clientSecret: "secret", refreshToken: "refresh"};

type RequestAuthorization = string | null;

interface RecordedRequest {
  url: string;
  authorization: RequestAuthorization;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {status});
}

it("exchanges the refresh token then pages through activities until an empty page", async () => {
  const requests: RecordedRequest[] = [];
  const fakeFetch: typeof fetch = async (input, init) => {
    const url = String(input);
    requests.push({url, authorization: new Headers(init?.headers).get("Authorization")});

    if (url.endsWith("/oauth/token")) {
      return jsonResponse({access_token: "access", refresh_token: "refresh-2"});
    }

    if (url.includes("page=1")) {
      return jsonResponse([{id: 1}, {id: 2}]);
    }

    return jsonResponse([]);
  };

  const result = await fetchAllActivities(credentials, fakeFetch);

  expect(result.activities).toEqual([{id: 1}, {id: 2}]);
  expect(result.refreshToken).toBe("refresh-2");
  expect(requests.map(request => request.authorization)).toEqual([null, "Bearer access", "Bearer access"]);
  expect(requests[1]?.url).toContain("per_page=200&page=1");
  expect(requests[2]?.url).toContain("page=2");
});

it("fails with the status only, never echoing secrets", async () => {
  const fakeFetch: typeof fetch = async () => jsonResponse({message: "bad", secret: "secret"}, 401);

  await expect(fetchAllActivities(credentials, fakeFetch)).rejects.toThrow(
    "Strava token refresh failed with status 401",
  );
  await expect(fetchAllActivities(credentials, fakeFetch)).rejects.not.toThrow(/secret/);
});
