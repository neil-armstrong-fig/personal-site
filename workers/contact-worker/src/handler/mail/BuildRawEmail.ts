import type {ContactMessage} from "@personal-site/shared/contact/types/ContactMessage";

interface BuildRawEmailOptions {
  contactMessage: ContactMessage;
  fromAddress: string;
  toAddress: string;
  messageId: string;
  date: Date;
}

const lineEnding = "\r\n";
const bodyLineLength = 76;

// Builds an RFC 5322 message. Every visitor-controlled value is either base64-encoded (display names, subject, body)
// or already validated to be a single-line address, so nothing a visitor types can add a header.
export function buildRawEmail({contactMessage, fromAddress, toAddress, messageId, date}: BuildRawEmailOptions): string {
  const fromDomain = fromAddress.slice(fromAddress.indexOf("@") + 1);
  const body = `Name: ${contactMessage.name}${lineEnding}Email: ${contactMessage.email}${lineEnding}${lineEnding}${contactMessage.message}`;

  const headers = [
    `From: ${encodedWord("Website contact form")} <${fromAddress}>`,
    `To: ${toAddress}`,
    `Reply-To: ${encodedWord(contactMessage.name)} <${contactMessage.email}>`,
    `Subject: ${encodedWord(`Website message from ${contactMessage.name}`)}`,
    `Date: ${date.toUTCString()}`,
    `Message-ID: <${messageId}@${fromDomain}>`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
  ];

  return headers.join(lineEnding) + lineEnding + lineEnding + wrapBase64(base64(body));
}

// RFC 2047 encoded word, so a name containing quotes, commas or non-ASCII characters is safe in a header.
function encodedWord(text: string): string {
  return `=?UTF-8?B?${base64(text)}?=`;
}

function base64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

function wrapBase64(encoded: string): string {
  const lines: string[] = [];

  for (let start = 0; start < encoded.length; start += bodyLineLength) {
    lines.push(encoded.slice(start, start + bodyLineLength));
  }

  return lines.join(lineEnding);
}
