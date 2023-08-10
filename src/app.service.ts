import { Injectable } from "@nestjs/common";

import { IdentifyContactDto } from "./app.dto";
import { LinkPrecedence } from "./utils/enums";
import { Contact } from "./contacts/entities/contact.entity";
import { ContactsService } from "./contacts/contacts.service";

@Injectable()
export class AppService {
  constructor(private contactService: ContactsService) {}

  async identifyContacts(identifyContactDto: IdentifyContactDto) {
    const createdContact = await this.contactService.create(identifyContactDto);
    console.log("createdContact: ", createdContact);

    const result = {
      primaryContactId: createdContact.id,
      primaryContact: null,
      emails: [],
      phoneNumbers: [],
      secondaryContactIds: [],
    };

    if (identifyContactDto.email) {
      const emailContacts = await this.contactService.findByEmail(
        identifyContactDto.email,
      );

      console.log("emailContacts: ", emailContacts);
      if (emailContacts.length > 0) {
        for (let i = 0; i < emailContacts.length; i++)
          await this.findLinks(emailContacts[i], false, result);
      }
    }

    if (identifyContactDto.phoneNumber) {
      const phoneNumberContacts = await this.contactService.findByPhoneNumber(
        identifyContactDto.phoneNumber,
      );

      console.log("phoneNumberContacts: ", phoneNumberContacts);
      if (phoneNumberContacts.length > 0)
        for (let i = 0; i < phoneNumberContacts.length; i++)
          await this.findLinks(phoneNumberContacts[i], false, result);
    }

    delete result["primaryContact"];
    return { contact: result };
  }

  // Recursive helped function to find all contact links
  async findLinks(
    contact: Contact,
    loopOnce: boolean,
    result: {
      primaryContactId: number;
      primaryContact: Contact | null;
      emails: string[];
      phoneNumbers: string[];
      secondaryContactIds: number[];
    },
  ) {
    if (contact.linkedPrecedence === LinkPrecedence.PRIMARY) {
      result.primaryContact = result.primaryContact
        ? result.primaryContact.createdAt < contact.createdAt
          ? result.primaryContact
          : contact
        : contact;

      result.primaryContactId = result.primaryContact
        ? result.primaryContact.createdAt < contact.createdAt
          ? result.primaryContactId
          : contact.id
        : contact.id;

      console.log("result.primaryContactId: ", result.primaryContactId);

      if (!result.emails.includes(contact.email) && contact.email)
        result.emails.splice(0, 0, contact.email);

      if (
        !result.phoneNumbers.includes(contact.phoneNumber) &&
        contact.phoneNumber
      )
        result.phoneNumbers.splice(0, 0, contact.phoneNumber);

      const secondaryContacts = await this.contactService.findAll({
        phoneNumber: contact.phoneNumber,
        linkedPrecedence: LinkPrecedence.SECONDARY,
      });

      console.log("result.secondaryContacts: ", secondaryContacts);

      if (loopOnce) return;
      for (let i = 0; i < secondaryContacts.length; i++) {
        await this.findLinks(secondaryContacts[i], true, result);
      }
    } else {
      if (
        contact.id !== result.primaryContactId &&
        !result.secondaryContactIds.includes(contact.id)
      )
        result.secondaryContactIds.push(contact.id);

      if (!result.emails.includes(contact.email) && contact.email)
        result.emails.push(contact.email);

      if (
        !result.phoneNumbers.includes(contact.phoneNumber) &&
        contact.phoneNumber
      )
        result.phoneNumbers.push(contact.phoneNumber);

      console.log("result: ", result);

      if (contact.linkedId) {
        console.log("contact.linkedId", contact.linkedId);

        const primaryContact = await this.contactService.findOne(
          contact.linkedId,
        );

        if (loopOnce) return;
        if (primaryContact) await this.findLinks(primaryContact, true, result);
      }
    }
  }
}
