export const turnstileVerificationResults = ["verified", "rejected", "unavailable"] as const;

export type TurnstileVerificationResult = (typeof turnstileVerificationResults)[number];
