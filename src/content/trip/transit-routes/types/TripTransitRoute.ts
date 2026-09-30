import type {PolylinePoint} from "@src/content/trip/strava/routes/types/PolylinePoint";

export interface TripTransitRoute {
  id: string;
  activityId: number;
  name: string;
  points: PolylinePoint[];
  sourceUrl: string;
}
