import type {StravaActivitySummary} from "@src/scripts/shared/strava/types/StravaActivitySummary.ts";
import type {StravaCredentials} from "@src/scripts/shared/strava/types/StravaCredentials.ts";
import {refreshStravaAccess} from "@src/scripts/shared/strava/strava-access/StravaAccess.ts";

interface StravaActivityFetch {
  activities: StravaActivitySummary[];
  refreshToken: string;
}

const apiBase = "https://www.strava.com";
const pageSize = 200;

export async function fetchAllActivities(
  credentials: StravaCredentials,
  fetchImplementation: typeof fetch = fetch,
): Promise<StravaActivityFetch> {
  const {accessToken, refreshToken} = await refreshStravaAccess(credentials, fetchImplementation);
  const activities: StravaActivitySummary[] = [];

  for (let page = 1; ; page += 1) {
    const response = await fetchImplementation(
      `${apiBase}/api/v3/athlete/activities?per_page=${pageSize}&page=${page}`,
      {
        headers: {Authorization: `Bearer ${accessToken}`},
      },
    );

    if (!response.ok) {
      throw new Error(`Strava activity request failed with status ${response.status}.`);
    }

    const pageActivities = (await response.json()) as StravaActivitySummary[];

    if (pageActivities.length === 0) {
      return {activities, refreshToken};
    }

    activities.push(...pageActivities);
  }
}
