import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

import { AppService } from "./app.service";
import { IdentifyContactDto } from "./app.dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("identify")
  @HttpCode(HttpStatus.ACCEPTED)
  identifyContacts(@Body() identifyContactDto: IdentifyContactDto) {
    return this.appService.identifyContacts(identifyContactDto);
  }
}
