import type {ContactFieldName} from "./ContactFieldName";

// The JSON the Worker answers the form with; the form reads it, so both sides are written against this one type.
export interface ContactResponse {
  ok: boolean;
  invalidFields?: readonly ContactFieldName[];
}
