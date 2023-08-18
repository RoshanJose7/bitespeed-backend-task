import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, Logger } from "@nestjs/common";
import { FindOptionsWhere, Repository } from "typeorm";

import { LinkPrecedence } from "../utils/enums";
import { Contact } from "./entities/contact.entity";
import { CreateContactDto } from "./dto/create-contact.dto";
import { UpdateContactDto } from "./dto/update-contact.dto";

@Injectable()
export class ContactsService {
  private logger = new Logger(ContactsService.name);

  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  /**
   * Create a new contact.
   * @param {CreateContactDto} createContactDto - The data for creating a new contact.
   * @returns {Promise<Contact>} A promise that resolves to the created contact.
   */
  async create(createContactDto: CreateContactDto): Promise<Contact> {
    // Check if a contact with the provided email or phone number already exists
    const oldContact = await this.findOneContact(
      createContactDto.email,
      createContactDto.phoneNumber,
    );

    this.logger.log(`oldContact: ${oldContact}`);

    // If an oldContact already exists, return it (avoid creating duplicates)
    if (oldContact) return oldContact;

    // Check the linked contacts for possible link precedence updates
    const result = await this.checkContact(createContactDto);

    // If there is a secondary contact, update its link precedence to SECONDARY
    if (result.primary) {
      // If there is a primary contact, set linkedId and linkedPrecedence
      createContactDto.linkedId = result.primary.id;
      createContactDto.linkedPrecedence = LinkPrecedence.SECONDARY;
    } else if (result.secondary) {
      await this.update(result.secondary.id, {
        linkedPrecedence: LinkPrecedence.SECONDARY,
      });

      // Update the linkedPrecedence property of the secondary contact object
      result.secondary.linkedPrecedence = LinkPrecedence.SECONDARY;
      return result.secondary;
    }

    // Create a new contact entity using the provided DTO
    const contact = this.contactRepository.create(createContactDto);

    // Save the newly created contact entity to the database
    return this.contactRepository.save(contact);
  }

  /**
   * Retrieve contacts based on the provided conditions.
   * @param {FindOptionsWhere<Contact>} conditions - The conditions used for filtering the contacts.
   * @returns {Promise<Contact[]>} A promise that resolves to an array of contacts.
   */
  findAll(conditions?: FindOptionsWhere<Contact>): Promise<Contact[]> {
    // Use the contactRepository to find contacts based on the provided conditions
    return this.contactRepository.find({
      where: conditions,
    });
  }

  /**
   * Retrieve a contact by its ID.
   * @param {number} id - The ID of the contact to retrieve.
   * @returns {Promise<Contact>} A promise that resolves to the retrieved contact.
   */
  findOne(id: number): Promise<Contact> {
    // Use the contactRepository to find a contact by ID, or throw an error if not found
    return this.contactRepository.findOneOrFail({ where: { id } });
  }

  /**
   * Retrieve a contact by email and phone number.
   * @param {string} email - The email of the contact.
   * @param {string} phoneNumber - The phone number of the contact.
   * @returns {Promise<Contact | null>} A promise that resolves to the retrieved contact or null if not found.
   */
  findOneContact(email: string, phoneNumber: string): Promise<Contact | null> {
    // Use the contactRepository to find a contact by email and phoneNumber
    // If found, return the contact; if not found, return null
    return this.contactRepository.findOne({ where: { email, phoneNumber } });
  }

  /**
   * Retrieve contacts by email.
   * @param {string} email - The email to search for.
   * @returns {Promise<Contact[]>} A promise that resolves to an array of contacts with the provided email.
   */
  async findByEmail(email: string): Promise<Contact[]> {
    // Use the contactRepository to find contacts by email
    return this.contactRepository.find({ where: { email } });
  }

  /**
   * Retrieve contacts by phone number.
   * @param {string} phoneNumber - The phone number to search for.
   * @returns {Promise<Contact[]>} A promise that resolves to an array of contacts with the provided phone number.
   */
  async findByPhoneNumber(phoneNumber: string): Promise<Contact[]> {
    // Use the contactRepository to find contacts by phoneNumber
    return this.contactRepository.find({ where: { phoneNumber } });
  }

  /**
   * Update a contact by ID.
   * @param {number} id - The ID of the contact to update.
   * @param {UpdateContactDto} updateContactDto - The data for updating the contact.
   * @returns {Promise<Contact>} A promise that resolves to the updated contact.
   */
  async update(
    id: number,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    // Update the contact with the specified id using updateContactDto
    await this.contactRepository.update({ id }, updateContactDto);
    // Return the updated contact entity
    return this.findOne(id);
  }

  /**
   * Remove a contact by ID.
   * @param {number} id - The ID of the contact to remove.
   * @returns {Promise<Contact>} A promise that resolves to the removed contact.
   */
  async remove(id: number): Promise<Contact> {
    // Find the contact with the specified id
    const contact = await this.findOne(id);

    // Delete the contact with the specified id from the repository
    await this.contactRepository.delete({ id });

    // Return the deleted contact entity
    return contact;
  }

  /**
   * Check and determine primary and secondary contacts based on email and phone number.
   * @param {CreateContactDto} createContactDto - The data for the contact being created.
   * @returns {Promise<{ primary?: Contact; secondary?: Contact }>} A promise that resolves to an object containing primary and secondary contacts.
   */
  async checkContact(
    createContactDto: CreateContactDto,
  ): Promise<{ primary?: Contact; secondary?: Contact }> {
    const { email, phoneNumber } = createContactDto;

    let emailContact = null,
      phoneNumberContact = null;

    // Check if an email is provided and find contacts with the same email
    if (email) {
      const contacts = await this.contactRepository.find({
        where: { email },
        order: { createdAt: "DESC" }, // Order by creation time, descending
      });

      if (contacts.length > 0) {
        emailContact = contacts[0]; // Get the most recent contact with the email
      }
    }

    // Check if a phone number is provided and find contacts with the same phone number
    if (phoneNumber) {
      const contacts = await this.contactRepository.find({
        where: { phoneNumber },
        order: { createdAt: "ASC" }, // Order by creation time, ascending
      });

      if (contacts.length > 0) {
        phoneNumberContact = contacts[0]; // Get the oldest contact with the phone number
      }
    }

    // Determine primary and secondary contacts based on conditions
    if (emailContact && phoneNumberContact) {
      const primary =
        emailContact.createdAt < phoneNumberContact.createdAt
          ? emailContact
          : phoneNumberContact;

      const secondary =
        emailContact === phoneNumberContact
          ? null
          : primary === emailContact
          ? phoneNumberContact
          : emailContact;

      this.logger.log(`primary: ${primary}`);
      this.logger.log(`secondary: ${secondary}`);

      return { primary, secondary };
    } else if (emailContact) {
      return { primary: emailContact, secondary: null };
    } else if (phoneNumberContact) {
      return { primary: phoneNumberContact, secondary: null };
    } else {
      return {}; // No matching contacts found
    }
  }
}
