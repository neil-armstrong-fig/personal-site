interface DualUnitDistance {
  metric: string;
  imperial: string;
}

const KILOMETRES_TO_MILES = 0.621371;
const wholeNumber = new Intl.NumberFormat("en-GB", {maximumFractionDigits: 0});

export function formatTripDistance(kilometres: number): DualUnitDistance {
  return {
    metric: `${wholeNumber.format(kilometres)} km`,
    imperial: `${wholeNumber.format(kilometres * KILOMETRES_TO_MILES)} mi`,
  };
}
