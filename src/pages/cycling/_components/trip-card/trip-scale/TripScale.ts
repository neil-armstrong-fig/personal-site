const MILLISECONDS_PER_DAY = 86_400_000;
const MAJOR_TRIP_DAYS = 28;

interface TripScaleInput {
  startDate: Date;
  endDate: Date;
  parts: number;
}

interface TripScale {
  label: string;
  major: boolean;
}

export function describeTripScale({startDate, endDate, parts}: TripScaleInput): TripScale {
  const days = Math.round((endDate.getTime() - startDate.getTime()) / MILLISECONDS_PER_DAY) + 1;

  if (parts > 1) {
    return {label: `${parts} parts`, major: true};
  }

  return {label: `${days} days`, major: days >= MAJOR_TRIP_DAYS};
}
