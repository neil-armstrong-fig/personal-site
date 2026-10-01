import {contactFieldNames} from "./ContactFieldNames";
import {contactLimits} from "./ContactLimits";
import type {ContactFieldName} from "./types/ContactFieldName";
import type {ContactMessage} from "./types/ContactMessage";
import type {ContactMessageValidation} from "./types/ContactMessageValidation";

const lineBreak = /[\r\n]/;
// Deliberately loose: one "@", no whitespace, and a dot in the domain. The real test is whether a reply is delivered.
const emailShape = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactMessage(fields: Readonly<Record<ContactFieldName, unknown>>): ContactMessageValidation {
  const name = trimmed(fields.name);
  const email = trimmed(fields.email);
  const message = trimmed(fields.message);

  const fieldIsValid: Readonly<Record<ContactFieldName, boolean>> = {
    name: name.length > 0 && name.length <= contactLimits.nameMaxLength && !lineBreak.test(name),
    email: email.length <= contactLimits.emailMaxLength && emailShape.test(email) && !lineBreak.test(email),
    message: message.length > 0 && message.length <= contactLimits.messageMaxLength,
  };
  const invalidFields = contactFieldNames.filter(fieldName => !fieldIsValid[fieldName]);

  if (invalidFields.length > 0) {
    return {valid: false, invalidFields};
  }

  const contactMessage: ContactMessage = {name, email, message};

  return {valid: true, message: contactMessage};
}

function trimmed(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}
