import { In, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { IdentifyContactDto } from "./app.dto";
import { LinkPrecedence } from "./utils/enums";
import { Contact } from "./contacts/entities/contact.entity";
import { IIdentifyContactResponse } from "./utils/interfaces";

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  /**
   * Identify contacts based on the provided DTO.
   * @param {IdentifyContactDto} identifyContactDto - The data for identifying contacts.
   * @returns {Promise<{ contact: IIdentifyContactResponse }>} A promise that resolves to the identification result.
   */
  async identifyContacts(
    identifyContactDto: IdentifyContactDto,
  ): Promise<{ contact: IIdentifyContactResponse }> {
    // Find contacts that match the given email or phone number.
    const contacts = await this.contactRepository.find({
      where: [
        { email: identifyContactDto.email },
        { phoneNumber: identifyContactDto.phoneNumber },
      ],
    });

    // Find secondary contacts from the contacts list.
    let secondaryContacts = contacts.filter(
      (contact) => contact.linkedPrecedence === "secondary",
    );

    // Find unique linked IDs of secondary contacts.
    const secondaryLinkedUniqueIDs = new Set(
      secondaryContacts.map((c) => c.linkedId).filter(Boolean),
    );

    // Find primary contacts from the unique linked IDs.
    const primaryContacts = await this.contactRepository.find({
      where: {
        id: In([...secondaryLinkedUniqueIDs]),
        linkedPrecedence: LinkPrecedence.PRIMARY,
      },
    });

    // Add primary contacts to the contacts list and sort based on Creation Date.
    contacts.push(...primaryContacts);
    contacts.sort((a, b) => a.createdAt.valueOf() - b.createdAt.valueOf());

    // Find the first primary contact from the sorted contacts list.
    let primaryContact = contacts.find(
      (contact) => contact.linkedPrecedence === "primary",
    );

    // Create a new primary contact if no contact matches both email and phoneNumber.
    if (!primaryContact) {
      primaryContact = await this.contactRepository.save({
        email: identifyContactDto.email,
        phoneNumber: identifyContactDto.phoneNumber,
        linkedPrecedence: LinkPrecedence.PRIMARY,
      });

      return {
        contact: {
          primaryContactId: primaryContact.id,
          emails: [primaryContact.email],
          phoneNumbers: [primaryContact.phoneNumber],
          secondaryContactIds: [],
        },
      };
    }

    // Create a new secondary contact if no contact matches both email and phoneNumber.
    if (
      !contacts.some(
        (contact) =>
          contact.email === identifyContactDto.email &&
          contact.phoneNumber === identifyContactDto.phoneNumber,
      )
    ) {
      const newContact = await this.contactRepository.save({
        email: identifyContactDto.email,
        phoneNumber: identifyContactDto.phoneNumber,
        linkedId: primaryContact.id,
        linkedPrecedence: LinkPrecedence.SECONDARY,
      });

      contacts.push(newContact);
    }

    // Fetch secondary contact IDs that is to be updated with the primary contact ID.
    const contactIdsToUpdate: number[] = contacts
      .filter((contact) => contact.id !== primaryContact.id)
      .map((contact) => contact.id);

    await this.contactRepository.update(contactIdsToUpdate, {
      linkedId: primaryContact.id,
      linkedPrecedence: LinkPrecedence.SECONDARY,
    });

    // Fetch secondary contacts that are linked to the primary contact.
    secondaryContacts = await this.contactRepository.find({
      where: {
        linkedId: primaryContact.id,
        linkedPrecedence: LinkPrecedence.SECONDARY,
      },
    });

    return {
      contact: {
        primaryContactId: primaryContact.id,
        emails: [
          ...new Set(
            [
              primaryContact.email,
              ...secondaryContacts.map((c) => c.email),
            ].filter((c) => !!c),
          ),
        ],
        phoneNumbers: [
          ...new Set(
            [
              primaryContact.phoneNumber,
              ...secondaryContacts.map((c) => c.phoneNumber),
            ].filter((c) => !!c),
          ),
        ],
        secondaryContactIds: secondaryContacts.map((c) => c.id),
      },
    };
  }
}
