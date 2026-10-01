import type {TripMapActivityKind} from "./TripMapActivityKind.ts";

export interface TripMapActivity {
  id: number;
  date: string;
  name: string;
  kind: TripMapActivityKind;
  colourIndex?: number;
  start: boolean;
  finish: boolean;
}
