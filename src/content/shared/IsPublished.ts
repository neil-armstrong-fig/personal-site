interface PublicationState {
  draft: boolean;
}

interface EntryWithDraftFlag {
  data: PublicationState;
}

export function isPublished(entry: EntryWithDraftFlag): boolean {
  return !entry.data.draft;
}
