import { Controller, Get, Query } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {
	}

	@Get("identify")
	identifyContacts(
		@Query("email") email?: string,
		@Query("phoneNumber") phoneNumber?: string
	) {
		return this.appService.identifyContacts({ email, phoneNumber });
	}
}
