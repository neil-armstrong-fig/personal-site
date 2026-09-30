export interface TripSnapshotMeasurements {
  id: number;
  date: string;
  name: string;
  distanceMetres: number;
  elevationMetres: number;
  movingTimeSeconds: number;
  public: boolean;
}
