interface DualUnitElevation {
  metric: string;
  imperial: string;
}

const METRES_TO_FEET = 3.28084;
const wholeNumber = new Intl.NumberFormat("en-GB", {maximumFractionDigits: 0});

export function formatTripElevation(metres: number): DualUnitElevation {
  return {
    metric: `${wholeNumber.format(metres)} m`,
    imperial: `${wholeNumber.format(metres * METRES_TO_FEET)} ft`,
  };
}
