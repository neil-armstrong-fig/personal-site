import {numberedDayPattern} from "./numbered-day-pattern/NumberedDayPattern.ts";
import type {TripSource} from "@src/scripts/shared/strava/types/TripSource.ts";

// Days are numbered rides named "PREFIX Day N" or "PREFIX-N". Short transition rides retain their measurements
// but not a riding day; practice, side-quest and rest-day rides also do not add a day. Long walks and hikes carrying
// the trip prefix are listed separately as outings.
export const tripSources = [
  {
    slug: "belfast-rotterdam-2023",
    dayPattern: numberedDayPattern("BTR|RTB"),
    prefixPattern: /^(?:BTR|RTB)(?!\w)/i,
    // Belfast departure, Rotterdam ferry transfer and Belfast arrival.
    transitionActivityIds: [9_668_040_826, 9_803_086_090, 9_825_938_194],
    // "Would be a shame naught to": an unprefixed ride between the two halves of the trip.
    bonusRides: {ids: [9_756_461_976]},
  },
  {
    slug: "belfast-rotterdam-2024",
    dayPattern: numberedDayPattern("BTR2|RTB2"),
    prefixPattern: /^(?:BTR2|RTB2)(?!\w)/i,
    // Rotterdam ferry transfer and Belfast arrival.
    transitionActivityIds: [12_389_494_531, 12_412_924_913],
    // The 127 km bonus ride the week after arriving in the Netherlands.
    bonusRides: {ids: [12_314_436_990, 12_358_292_078]},
  },
  {
    slug: "porto-to-faro",
    dayPattern: numberedDayPattern("PTF"),
    prefixPattern: /^PTF(?!\w)/i,
    // Porto bike-and-weather test before Day 1, then the Lisbon west-coast side quest.
    bonusRides: {ids: [11_369_434_972, 11_408_894_321]},
  },
  {
    slug: "tokyo-to-seoul",
    dayPattern: numberedDayPattern("TTS"),
    prefixPattern: /^TTS(?!\w)/i,
  },
  {
    slug: "rotterdam-to-rotterdam",
    dayPattern: numberedDayPattern("RTR"),
    prefixPattern: /^RTR(?!\w|-FT)/i,
  },
  {
    slug: "loop-of-europe",
    dayPattern: /^FT-(?<leg>[A-Z]+)-[1-9]\d*(?::\s*(?<title>.+))?$/i,
    prefixPattern: /^FT-/i,
    bonusRides: {pattern: /^FT-(?<leg>[A-Z]+)(?::\s*(?<title>.+))?$/i},
    legs: {
      RTR: {name: "Rotterdam to Romania"},
      ATB: {name: "Alba Iulia to Bucharest"},
      BTV: {name: "Bucharest to Vienna", transition: true},
      VTG: {name: "Vienna to Geneva"},
      GTC: {name: "Geneva to Cherbourg"},
      CTD: {name: "Cherbourg to Dublin", transition: true},
      DTB: {name: "Dublin to Belfast"},
    },
  },
] as const satisfies readonly TripSource[];
