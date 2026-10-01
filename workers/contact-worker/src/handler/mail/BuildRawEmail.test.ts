import {expect, it} from "vitest";

import {buildRawEmail} from "./BuildRawEmail";

const options = {
  contactMessage: {name: "Ada Lovelace", email: "ada@example.com", message: "Hello there.\nSecond line."},
  fromAddress: "contact@neilarmstrong.dev",
  toAddress: "inbox@example.org",
  messageId: "abc123",
  date: new Date("2026-10-01T10:00:00Z"),
};

it("writes the envelope headers, with the visitor as Reply-To", () => {
  const headers = headerLines(buildRawEmail(options));

  expect(headers).toContain("From: =?UTF-8?B?V2Vic2l0ZSBjb250YWN0IGZvcm0=?= <contact@neilarmstrong.dev>");
  expect(headers).toContain("To: inbox@example.org");
  expect(headers).toContain(`Reply-To: ${encodedWord("Ada Lovelace")} <ada@example.com>`);
  expect(headers).toContain("Date: Thu, 01 Oct 2026 10:00:00 GMT");
  expect(headers).toContain("Message-ID: <abc123@neilarmstrong.dev>");
  expect(headers).toContain("MIME-Version: 1.0");
});

it("encodes the subject, which carries the visitor's name", () => {
  const headers = headerLines(buildRawEmail(options));

  expect(headers).toContain(`Subject: ${encodedWord("Website message from Ada Lovelace")}`);
});

it("carries a non-ASCII name intact", () => {
  const raw = buildRawEmail({...options, contactMessage: {...options.contactMessage, name: "Zoë Ó Briain"}});

  expect(headerLines(raw)).toContain(`Reply-To: ${encodedWord("Zoë Ó Briain")} <ada@example.com>`);
});

it("puts the body in base64 UTF-8 that decodes to the message", () => {
  const raw = buildRawEmail(options);
  const body = raw.split("\r\n\r\n")[1] ?? "";

  expect(headerLines(raw)).toContain("Content-Type: text/plain; charset=UTF-8");
  expect(headerLines(raw)).toContain("Content-Transfer-Encoding: base64");
  expect(Buffer.from(body.replaceAll("\r\n", ""), "base64").toString("utf8")).toBe(
    "Name: Ada Lovelace\r\nEmail: ada@example.com\r\n\r\nHello there.\nSecond line.",
  );
});

it("cannot be made to add a header through the message text", () => {
  const raw = buildRawEmail({
    ...options,
    contactMessage: {...options.contactMessage, message: "Hi\r\nBcc: someone@example.org"},
  });

  expect(headerLines(raw).some(line => line.startsWith("Bcc:"))).toBe(false);
  expect(raw).not.toContain("Bcc: someone");
});

it("wraps the body at 76 characters and uses CRLF line endings throughout", () => {
  const raw = buildRawEmail({...options, contactMessage: {...options.contactMessage, message: "x".repeat(500)}});
  const lines = raw.split("\r\n");

  expect(raw.replaceAll("\r\n", "")).not.toMatch(/[\r\n]/);
  expect(lines.slice(lines.indexOf("") + 1).every(line => line.length <= 76)).toBe(true);
});

function headerLines(raw: string): string[] {
  return (raw.split("\r\n\r\n")[0] ?? "").split("\r\n");
}

function encodedWord(text: string): string {
  return `=?UTF-8?B?${Buffer.from(text, "utf8").toString("base64")}?=`;
}
