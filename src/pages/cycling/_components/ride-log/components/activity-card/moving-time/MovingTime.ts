export function formatMovingTime(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  const remainder = String(minutes % 60).padStart(2, "0");

  return `${Math.floor(minutes / 60)} h ${remainder} min`;
}
