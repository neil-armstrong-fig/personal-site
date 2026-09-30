import type {RouteMapColours} from "./types/RouteMapColours";

export function readRouteMapColours(): RouteMapColours {
  const styles = getComputedStyle(document.documentElement);
  return {
    copper: styles.getPropertyValue("--color-copper").trim(),
    ink: styles.getPropertyValue("--color-ink").trim(),
    paper: styles.getPropertyValue("--color-paper").trim(),
    petrol: styles.getPropertyValue("--color-petrol").trim(),
  };
}
