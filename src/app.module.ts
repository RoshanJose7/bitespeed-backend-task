import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { ContactsModule } from "./contacts/contacts.module";
import { configService } from "./config/env.config.service";
import { Contact } from "./contacts/entities/contact.entity";

@Module({
	imports: [
		TypeOrmModule.forRootAsync(configService.typeOrmAsyncConfig),
		TypeOrmModule.forFeature([Contact]),
		ContactsModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {
}
