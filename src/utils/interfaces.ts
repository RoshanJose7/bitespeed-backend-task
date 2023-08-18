import { Contact } from "../contacts/entities/contact.entity";

export interface IIdentifyContactResponse {
  primaryContactId?: number;
  primaryContact: Contact;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
}
