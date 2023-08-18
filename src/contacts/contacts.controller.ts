import {
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Controller,
} from "@nestjs/common";

import { ContactsService } from "./contacts.service";
import { CreateContactDto } from "./dto/create-contact.dto";
import { UpdateContactDto } from "./dto/update-contact.dto";
import { Contact } from "./entities/contact.entity";

@Controller("contacts")
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  /**
   * HTTP POST endpoint to create a new contact
   * @param {CreateContactDto} createContactDto - The data for creating a new contact
   * @returns {Promise<Contact>} A promise that resolves to the created contact
   */
  @Post()
  create(@Body() createContactDto: CreateContactDto): Promise<Contact> {
    return this.contactsService.create(createContactDto);
  }

  /**
   * HTTP GET endpoint to retrieve all contacts
   * @returns {Promise<Contact[]>} A promise that resolves to an array of contacts
   */
  @Get()
  findAll(): Promise<Contact[]> {
    return this.contactsService.findAll();
  }

  /**
   * HTTP GET endpoint to retrieve a specific contact by ID
   * @param {string} id - The ID of the contact to retrieve
   * @returns {Promise<Contact>} A promise that resolves to the retrieved contact
   */
  @Get(":id")
  findOne(@Param("id") id: string): Promise<Contact> {
    return this.contactsService.findOne(+id);
  }

  /**
   * HTTP PATCH endpoint to update a contact by ID
   * @param {string} id - The ID of the contact to update
   * @param {UpdateContactDto} updateContactDto - The data for updating the contact
   * @returns {Promise<Contact>} A promise that resolves to the updated contact
   */
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    return this.contactsService.update(+id, updateContactDto);
  }

  /**
   * HTTP DELETE endpoint to remove a contact by ID
   * @param {string} id - The ID of the contact to remove
   * @returns {Promise<Contact>} A promise that resolves to the removed contact
   */
  @Delete(":id")
  remove(@Param("id") id: string): Promise<Contact> {
    return this.contactsService.remove(+id);
  }
}
