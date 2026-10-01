// Form fields that are not part of the message: a honeypot people never see, and the token Turnstile adds itself.
export const contactTransportFields = {
  honeypot: "website",
  turnstileToken: "cf-turnstile-response",
} as const;
