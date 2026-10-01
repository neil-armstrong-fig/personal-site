import type {AstroIntegration} from "astro";

import {tripFigures} from "./markdown/TripFigures";

interface SatteriOptions {
  mdastPlugins?: unknown[];
}

export function tripFiguresIntegration(): AstroIntegration {
  return {
    name: "trip-figures",
    hooks: {
      "astro:config:setup": ({config}) => {
        const processor = config.markdown.processor;

        if (processor.name !== "satteri") {
          throw new Error("The trip figure integration requires Astro's Sätteri Markdown processor.");
        }

        const options = processor.options as SatteriOptions;
        options.mdastPlugins ??= [];
        options.mdastPlugins.push(tripFigures());
      },
    },
  };
}
