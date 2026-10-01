import {expect, it} from "vitest";

import {contactLimits} from "./ContactLimits";
import {validateContactMessage} from "./ValidateContactMessage";

const validFields = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "Hello, I’d like to talk about a project.",
};

it("accepts a complete message and trims the fields", () => {
  const result = validateContactMessage({...validFields, name: "  Ada Lovelace  ", email: " ada@example.com "});

  expect(result).toEqual({valid: true, message: validFields});
});

it("rejects a blank name, email and message together", () => {
  const result = validateContactMessage({name: " ", email: "", message: "\n"});

  expect(result).toEqual({valid: false, invalidFields: ["name", "email", "message"]});
});

it("rejects an email without a domain", () => {
  const result = validateContactMessage({...validFields, email: "ada@"});

  expect(result).toEqual({valid: false, invalidFields: ["email"]});
});

it("rejects an email containing a line break, which could inject mail headers", () => {
  const result = validateContactMessage({...validFields, email: "ada@example.com\nBcc: someone@example.org"});

  expect(result).toEqual({valid: false, invalidFields: ["email"]});
});

it("rejects a name containing a line break", () => {
  const result = validateContactMessage({...validFields, name: "Ada\nBcc: someone@example.org"});

  expect(result).toEqual({valid: false, invalidFields: ["name"]});
});

it("rejects a message over the limit but accepts one exactly at it", () => {
  const atLimit = "a".repeat(contactLimits.messageMaxLength);

  expect(validateContactMessage({...validFields, message: atLimit}).valid).toBe(true);
  expect(validateContactMessage({...validFields, message: `${atLimit}a`})).toEqual({
    valid: false,
    invalidFields: ["message"],
  });
});

it("treats a missing or non-string field as invalid", () => {
  const result = validateContactMessage({name: undefined, email: 5, message: null});

  expect(result).toEqual({valid: false, invalidFields: ["name", "email", "message"]});
});
