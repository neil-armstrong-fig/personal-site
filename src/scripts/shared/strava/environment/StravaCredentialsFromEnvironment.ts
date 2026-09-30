import type {StravaCredentials} from "@src/scripts/shared/strava/types/StravaCredentials";
import {requiredEnvironment} from "@src/scripts/shared/strava/environment/RequiredEnvironment";

export function stravaCredentialsFromEnvironment(): StravaCredentials {
  return {
    clientId: requiredEnvironment("STRAVA_CLIENT_ID"),
    clientSecret: requiredEnvironment("STRAVA_CLIENT_SECRET"),
    refreshToken: requiredEnvironment("STRAVA_REFRESH_TOKEN"),
  };
}
