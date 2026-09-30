import type {Neighbours} from "./types/Neighbours";

interface EntryWithId {
  id: string;
}

export function findNeighbours<Entry extends EntryWithId>(entries: readonly Entry[], id: string): Neighbours<Entry> {
  const index = entries.findIndex(entry => entry.id === id);

  if (index === -1) {
    return {previous: undefined, next: undefined};
  }

  return {previous: entries[index - 1], next: entries[index + 1]};
}
