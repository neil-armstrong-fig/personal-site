const BASE_HUE = 188;
const GOLDEN_ANGLE = 137.508;

export function tripRouteColour(index: number): string {
  const hue = Number(((BASE_HUE + index * GOLDEN_ANGLE) % 360).toFixed(3));
  return `hsl(${hue} 62% 42%)`;
}
