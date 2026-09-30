interface TripLegSource {
  name: string;
  // Transition legs retain their measurements but do not increase the riding-day total.
  transition?: boolean;
}

interface TripBonusRideSource {
  pattern?: RegExp;
  ids?: readonly number[];
}

export interface TripSource {
  slug: string;
  // Matches a numbered day ride by name. Optional named groups: "title" is the text after the day label and
  // "leg" is the code of a multi-leg trip.
  dayPattern: RegExp;
  // Matches every activity name belonging to the trip, used to find its walks and hikes.
  prefixPattern: RegExp;
  // Named legs keyed by upper-case leg code; required when dayPattern captures a leg.
  legs?: Record<string, TripLegSource>;
  // Numbered rides that are short transfers around trains or ferries: retained and labelled in the ride log,
  // with their measurements included, but excluded from the riding-day total.
  transitionActivityIds?: readonly number[];
  // Unnumbered rides that still belong to the trip: shown among the days but not counted as days. Matched by
  // name pattern (optional "leg" and "title" groups) or by explicit Strava activity id.
  bonusRides?: TripBonusRideSource;
}
