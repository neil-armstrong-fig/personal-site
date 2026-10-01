export const CONFIRM_WINDOW_MS = 4000;

export const SELF_LINK_ACTIONS = ["ask", "push", "open"] as const;

export type SelfLinkAction = (typeof SELF_LINK_ACTIONS)[number];

export function nextSelfLinkAction(previous: SelfLinkAction | undefined, elapsedMs: number): SelfLinkAction {
  if (previous === undefined || previous === "open" || elapsedMs > CONFIRM_WINDOW_MS) {
    return "ask";
  }

  if (previous === "ask") {
    return "push";
  }

  return "open";
}
