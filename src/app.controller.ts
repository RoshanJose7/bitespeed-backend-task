import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

import { AppService } from "./app.service";
import { IdentifyContactDto } from "./app.dto";
import { IIdentifyContactResponse } from "./utils/interfaces";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Identify contacts based on the provided DTO.
   * @param {IdentifyContactDto} identifyContactDto - The data for identifying contacts.
   * @returns {Promise<{ contact: IIdentifyContactResponse }>} A promise that resolves to the identification result.
   */
  @Post("identify")
  @HttpCode(HttpStatus.ACCEPTED)
  identifyContacts(
    @Body() identifyContactDto: IdentifyContactDto,
  ): Promise<{ contact: IIdentifyContactResponse }> {
    // Call the identifyContacts function of the AppService with the provided DTO
    return this.appService.identifyContacts(identifyContactDto);
  }
}
