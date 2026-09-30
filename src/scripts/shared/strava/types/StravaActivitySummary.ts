interface StravaActivityMap {
  summary_polyline?: string;
}

export interface StravaActivitySummary {
  id: number;
  name: string;
  sport_type: string;
  start_date_local: string;
  distance: number;
  moving_time: number;
  total_elevation_gain: number;
  visibility?: string;
  map?: StravaActivityMap;
  photo_count?: number;
  total_photo_count?: number;
}
