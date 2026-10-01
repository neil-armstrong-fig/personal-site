// Full class names, so Tailwind can see them.
const pathClasses = ["animate-roam-a", "animate-roam-b", "animate-roam-c", "animate-roam-d"] as const;

const directions = ["normal", "reverse"] as const;

export interface RandomPlacement {
  left: number;
  top: number;
  delay: number;
  duration: number;
  pathClass: (typeof pathClasses)[number];
  direction: (typeof directions)[number];
}

/** A fresh start for one backdrop icon: where it sits, how far along its path, how fast, and which way it goes. */
export function randomPlacement(random: () => number): RandomPlacement {
  return {
    left: random() * 92,
    top: random() * 88,
    delay: random() * 40,
    duration: 16 + random() * 20,
    pathClass: pickOne(pathClasses, random),
    direction: pickOne(directions, random),
  };
}

function pickOne<Item>(items: readonly Item[], random: () => number): Item {
  return items[Math.floor(random() * items.length)] as Item;
}
