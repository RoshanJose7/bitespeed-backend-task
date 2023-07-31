import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { IdentifyContactDto } from "./app.dto";
import { LinkPrecedence } from "./utils/enums";
import { Contact } from "./contacts/entities/contact.entity";

@Injectable()
export class AppService {
	constructor(
		@InjectRepository(Contact)
		private contactRepository: Repository<Contact>
	) {
	}

	async identifyContacts(identifyContactDto: IdentifyContactDto) {
		const result = {
			primaryContactId: null,
			primaryContact: null,
			emails: [],
			phoneNumbers: [],
			secondaryContactIds: []
		};

		if (identifyContactDto.email) {
			const emailContacts = await this.contactRepository.find({
				where: {
					email: identifyContactDto.email
				}
			});

			if (emailContacts.length > 0) {
				for (let i = 0; i < emailContacts.length; i++)
					await this.findLinks(emailContacts[i], false, result);
			}
		}

		if (identifyContactDto.phoneNumber) {
			const phoneNumberContacts = await this.contactRepository.find({
				where: {
					phoneNumber: identifyContactDto.phoneNumber
				}
			});

			if (phoneNumberContacts.length > 0)
				for (let i = 0; i < phoneNumberContacts.length; i++)
					await this.findLinks(phoneNumberContacts[i], false, result);
		}

		delete result["primaryContact"];
		return { contact: result.primaryContactId ? result : null };
	}

	// Recursive helped function to find all contact links
	async findLinks(
		contact: Contact,
		loopOnce: boolean,
		result: {
			primaryContactId: number | null;
			primaryContact: Contact | null;
			emails: string[];
			phoneNumbers: string[];
			secondaryContactIds: number[];
		}
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

			if (!result.emails.includes(contact.email))
				result.emails.splice(0, 0, contact.email);

			if (!result.phoneNumbers.includes(contact.phoneNumber))
				result.phoneNumbers.splice(0, 0, contact.phoneNumber);

			const secondaryContacts = await this.contactRepository.find({
				where: {
					phoneNumber: contact.phoneNumber,
					linkedPrecedence: LinkPrecedence.SECONDARY
				}
			});

			if (loopOnce) return;
			for (let i = 0; i < secondaryContacts.length; i++) {
				await this.findLinks(secondaryContacts[i], true, result);
			}
		} else {
			if (!result.secondaryContactIds.includes(contact.id))
				result.secondaryContactIds.push(contact.id);

			if (!result.emails.includes(contact.email))
				result.emails.push(contact.email);

			if (!result.phoneNumbers.includes(contact.phoneNumber))
				result.phoneNumbers.push(contact.phoneNumber);

			if (contact.linkedId) {
				console.log("contact.linkedId", contact.linkedId);

				const primaryContact = await this.contactRepository.findOne({
					where: {
						id: contact.linkedId
					}
				});

				if (loopOnce) return;
				if (primaryContact) {
					await this.findLinks(primaryContact, true, result);
				}
			}
		}
	}
}
