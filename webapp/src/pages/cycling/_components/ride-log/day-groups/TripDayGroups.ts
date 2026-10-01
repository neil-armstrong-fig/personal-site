interface DayWithLeg {
  leg?: number;
}

type OptionalLegNumber = number | undefined;

interface TripDayGroup<Day extends DayWithLeg> {
  leg: OptionalLegNumber;
  days: Day[];
}

export function groupDaysByLeg<Day extends DayWithLeg>(days: readonly Day[]): TripDayGroup<Day>[] {
  const groups: TripDayGroup<Day>[] = [];

  for (const day of days) {
    const group = groups.find(candidate => candidate.leg === day.leg);

    if (group === undefined) {
      groups.push({leg: day.leg, days: [day]});
    } else {
      group.days.push(day);
    }
  }

  return groups;
}
