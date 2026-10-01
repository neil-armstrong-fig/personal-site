// Shared by the form's `maxlength` attributes and the Worker's server-side validation.
export const contactLimits = {
  nameMaxLength: 100,
  emailMaxLength: 254,
  messageMaxLength: 5000,
} as const;
