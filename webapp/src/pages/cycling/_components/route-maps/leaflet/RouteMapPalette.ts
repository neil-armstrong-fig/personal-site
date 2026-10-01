import type {RouteMapColours} from "./types/RouteMapColours";

/**
 * Fixed rather than read from the theme: the map tiles stay light in every theme, so the lines drawn on them must too.
 * These are the light values of the `@theme` tokens in `global.css`.
 */
export const routeMapColours: RouteMapColours = {
  copper: "#98462f",
  ink: "#18262d",
  paper: "#f4f7f6",
  petrol: "#1f5960",
};
