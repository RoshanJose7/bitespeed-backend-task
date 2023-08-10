import { FindOptionsWhere, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { LinkPrecedence } from "../utils/enums";
import { Contact } from "./entities/contact.entity";
import { CreateContactDto } from "./dto/create-contact.dto";
import { UpdateContactDto } from "./dto/update-contact.dto";

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const oldContact = await this.findOneContact(
      createContactDto.email,
      createContactDto.phoneNumber,
    );

    console.log("oldContact: ", oldContact);

    if (oldContact) return oldContact;

    const result = await this.checkContact(createContactDto);

    if (result) {
      if (result.secondary) {
        await this.update(result.secondary.id, {
          linkedPrecedence: LinkPrecedence.SECONDARY,
        });

        result.secondary.linkedPrecedence = LinkPrecedence.SECONDARY;
        return result.secondary;
      } else {
        createContactDto.linkedId = result.primary.id;
        createContactDto.linkedPrecedence = LinkPrecedence.SECONDARY;
      }
    }

    const contact = this.contactRepository.create(createContactDto);
    return this.contactRepository.save(contact);
  }

  findAll(conditions?: FindOptionsWhere<Contact>): Promise<Contact[]> {
    return this.contactRepository.find({
      where: conditions,
    });
  }

  findOne(id: number): Promise<Contact> {
    return this.contactRepository.findOneOrFail({ where: { id } });
  }

  findOneContact(email: string, phoneNumber: string): Promise<Contact | null> {
    return this.contactRepository.findOne({ where: { email, phoneNumber } });
  }

  findByEmail(email: string): Promise<Contact[]> {
    return this.contactRepository.find({ where: { email } });
  }

  findByPhoneNumber(phoneNumber: string): Promise<Contact[]> {
    return this.contactRepository.find({ where: { phoneNumber } });
  }

  async update(
    id: number,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    await this.contactRepository.update({ id }, updateContactDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<Contact> {
    const contact = await this.findOne(id);
    await this.contactRepository.delete({ id });
    return contact;
  }

  // Helper Functions
  async checkContact(
    createContactDto: CreateContactDto,
  ): Promise<{ primary?: Contact; secondary?: Contact }> {
    const { email, phoneNumber } = createContactDto;

    let emailContact = null,
      phoneNumberContact = null;

    if (email) {
      const contacts = await this.contactRepository.find({
        where: { email },
        order: { createdAt: "DESC" },
      });

      if (contacts.length > 0) {
        emailContact = contacts[0];
      }
    }

    if (phoneNumber) {
      const contacts = await this.contactRepository.find({
        where: { phoneNumber },
        order: { createdAt: "ASC" },
      });

      if (contacts.length > 0) {
        phoneNumberContact = contacts[0];
      }
    }

    if (emailContact && phoneNumberContact) {
      const primary =
        emailContact?.createdAt < phoneNumberContact?.createdAt
          ? emailContact
          : phoneNumberContact;

      const secondary =
        emailContact === phoneNumberContact
          ? null
          : primary === emailContact
            ? phoneNumberContact
            : emailContact;

      console.log("primary: ", primary);
      console.log("secondary: ", secondary);

      return { primary, secondary };
    } else if (emailContact) return { primary: emailContact, secondary: null };
    else if (phoneNumberContact)
      return { primary: phoneNumberContact, secondary: null };
    else return null;
  }
}