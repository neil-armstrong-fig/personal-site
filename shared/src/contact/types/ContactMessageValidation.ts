import type {ContactFieldName} from "./ContactFieldName";
import type {ContactMessage} from "./ContactMessage";

interface ValidContactMessage {
  valid: true;
  message: ContactMessage;
}

interface InvalidContactMessage {
  valid: false;
  invalidFields: readonly ContactFieldName[];
}

export type ContactMessageValidation = ValidContactMessage | InvalidContactMessage;
