import {expect, it} from "vitest";

import {groupDaysByLeg} from "./TripDayGroups";

interface DayWithoutLeg {
  leg?: number;
}

it("returns one ungrouped section for a trip without legs", () => {
  expect(
    groupDaysByLeg([
      {id: 1, leg: undefined},
      {id: 2, leg: undefined},
    ]),
  ).toEqual([{leg: undefined, days: [{id: 1}, {id: 2}]}]);
});

it("groups days by leg in order of first appearance", () => {
  expect(
    groupDaysByLeg([
      {id: 1, leg: 1},
      {id: 2, leg: 1},
      {id: 3, leg: 2},
    ]),
  ).toEqual([
    {
      leg: 1,
      days: [
        {id: 1, leg: 1},
        {id: 2, leg: 1},
      ],
    },
    {leg: 2, days: [{id: 3, leg: 2}]},
  ]);
});

it("returns no sections for no days", () => {
  expect(groupDaysByLeg<DayWithoutLeg>([])).toEqual([]);
});
