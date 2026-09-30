import type {StravaCredentials} from "@src/scripts/shared/strava/types/StravaCredentials.ts";

interface StravaAccess {
  accessToken: string;
  refreshToken: string;
}

interface StravaTokenResponse {
  access_token: string;
  refresh_token: string;
}

const apiBase = "https://www.strava.com";

export async function refreshStravaAccess(
  credentials: StravaCredentials,
  fetchImplementation: typeof fetch = fetch,
): Promise<StravaAccess> {
  const response = await fetchImplementation(`${apiBase}/oauth/token`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      refresh_token: credentials.refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error(`Strava token refresh failed with status ${response.status}.`);
  }

  const token = (await response.json()) as StravaTokenResponse;

  return {accessToken: token.access_token, refreshToken: token.refresh_token};
}
