import type {PolylinePoint} from "@src/content/trip/strava/routes/types/PolylinePoint";

export interface TripFerryRoute {
  id: string;
  name: string;
  points: PolylinePoint[];
  sourceUrl: string;
  activityId?: number;
}
