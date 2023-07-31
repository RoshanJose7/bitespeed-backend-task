import { Repository } from "typeorm";
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

  findAll(): Promise<Contact[]> {
    return this.contactRepository.find();
  }

  findOne(id: number): Promise<Contact> {
    return this.contactRepository.findOneOrFail({ where: { id } });
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
        primary === emailContact ? phoneNumberContact : emailContact;

      return { primary, secondary };
    } else if (emailContact) return { primary: emailContact, secondary: null };
    else if (phoneNumberContact)
      return { primary: phoneNumberContact, secondary: null };
    else return null;
  }
}
