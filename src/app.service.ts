import { Injectable } from "@nestjs/common";

import { IdentifyContactDto } from "./app.dto";
import { LinkPrecedence } from "./utils/enums";
import { Contact } from "./contacts/entities/contact.entity";
import { ContactsService } from "./contacts/contacts.service";
import { IIdentifyContactResponse } from "./utils/interfaces";

@Injectable()
export class AppService {
  constructor(private contactService: ContactsService) {}

  /**
   * Identify contacts based on the provided DTO.
   * @param {IdentifyContactDto} identifyContactDto - The data for identifying contacts.
   * @returns {Promise<{ contact: IIdentifyContactResponse }>} A promise that resolves to the identification result.
   */
  async identifyContacts(
    identifyContactDto: IdentifyContactDto,
  ): Promise<{ contact: IIdentifyContactResponse }> {
    // Create a new contact based on the provided DTO
    const createdContact = await this.contactService.create(identifyContactDto);
    console.log("createdContact: ", createdContact);

    // Initialize a result object to store contact information
    const result: IIdentifyContactResponse = {
      primaryContactId: createdContact.id,
      primaryContact: null,
      emails: [],
      phoneNumbers: [],
      secondaryContactIds: [],
    };

    // Check if email is provided and find contacts with matching email
    if (identifyContactDto.email) {
      const emailContacts = await this.contactService.findByEmail(
        identifyContactDto.email,
      );

      console.log("emailContacts: ", emailContacts);
      // If there are matching email contacts, find their links
      if (emailContacts.length > 0) {
        for (let i = 0; i < emailContacts.length; i++)
          await this.findLinks(emailContacts[i], false, result);
      }
    }

    // Check if phone number is provided and find contacts with matching phone number
    if (identifyContactDto.phoneNumber) {
      const phoneNumberContacts = await this.contactService.findByPhoneNumber(
        identifyContactDto.phoneNumber,
      );

      console.log("phoneNumberContacts: ", phoneNumberContacts);
      // If there are matching phone number contacts, find their links
      if (phoneNumberContacts.length > 0) {
        for (let i = 0; i < phoneNumberContacts.length; i++)
          await this.findLinks(phoneNumberContacts[i], false, result);
      }
    }

    // Remove the primaryContact key from the result and return the modified result
    delete result["primaryContact"];
    return { contact: result };
  }

  /**
   * Recursive helper function to find and process contact links.
   * @param {Contact} contact - The contact to process links for.
   * @param {boolean} loopOnce - Flag to determine if the loop should run only once.
   * @param {IIdentifyContactResponse} result - The result object to store contact information.
   * @returns {Promise<void>} A promise that resolves when link processing is complete.
   */
  async findLinks(
    contact: Contact,
    loopOnce: boolean,
    result: IIdentifyContactResponse,
  ): Promise<void> {
    // If the contact has primary link precedence
    if (contact.linkedPrecedence === LinkPrecedence.PRIMARY) {
      // Determine and update the primary contact based on creation time
      result.primaryContact = result.primaryContact
        ? result.primaryContact.createdAt < contact.createdAt
          ? result.primaryContact
          : contact
        : contact;

      // Update the primary contact ID based on the same condition
      result.primaryContactId = result.primaryContact
        ? result.primaryContact.createdAt < contact.createdAt
          ? result.primaryContactId
          : contact.id
        : contact.id;

      console.log("result.primaryContactId: ", result.primaryContactId);

      // Add contact email to result if not present
      if (!result.emails.includes(contact.email) && contact.email)
        result.emails.splice(0, 0, contact.email);

      // Add contact phone number to result if not present
      if (
        !result.phoneNumbers.includes(contact.phoneNumber) &&
        contact.phoneNumber
      )
        result.phoneNumbers.splice(0, 0, contact.phoneNumber);

      // Find secondary contacts linked to the same phone number
      const secondaryContacts = await this.contactService.findAll({
        phoneNumber: contact.phoneNumber,
        linkedPrecedence: LinkPrecedence.SECONDARY,
      });

      console.log("result.secondaryContacts: ", secondaryContacts);

      // If loopOnce flag is true, return
      if (loopOnce) return;
      // Recursively process secondary contacts
      for (let i = 0; i < secondaryContacts.length; i++) {
        await this.findLinks(secondaryContacts[i], true, result);
      }
    } else {
      // If the contact has secondary link precedence
      // Check if contact is not the primary contact and not already in secondaryContactIds
      if (
        contact.id !== result.primaryContactId &&
        !result.secondaryContactIds.includes(contact.id)
      )
        result.secondaryContactIds.push(contact.id);

      // Add contact email to result if not present
      if (!result.emails.includes(contact.email) && contact.email)
        result.emails.push(contact.email);

      // Add contact phone number to result if not present
      if (
        !result.phoneNumbers.includes(contact.phoneNumber) &&
        contact.phoneNumber
      )
        result.phoneNumbers.push(contact.phoneNumber);

      console.log("result: ", result);

      // If the contact is linked to another contact, recursively process the linked contact
      if (contact.linkedId) {
        console.log("contact.linkedId", contact.linkedId);

        const primaryContact = await this.contactService.findOne(
          contact.linkedId,
        );

        // If loopOnce flag is true, return
        if (loopOnce) return;
        // Recursively process the linked primary contact
        if (primaryContact) await this.findLinks(primaryContact, true, result);
      }
    }
  }
}
