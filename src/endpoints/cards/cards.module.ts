import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { registerEnumType } from "@nestjs/graphql";

import { Card } from "./entities/card.entity";
import { CardsService } from "./cards.service";
import { CardsResolver } from "./cards.resolver";
import { UsersModule } from "../users/users.module";
import { CardEnums } from "./constants/enums.constants";
import { CardTemplatesModule } from "../card_templates/card_templates.module";

@Module({
  imports: [UsersModule, CardTemplatesModule, TypeOrmModule.forFeature([Card])],
  providers: [CardsResolver, CardsService],
  exports: [CardsService],
})
export class CardsModule {
  constructor() {
    for (let i = 0; i < CardEnums.length; i++) {
      registerEnumType(CardEnums[i].enum, {
        name: CardEnums[i].name,
      });
    }
  }
}
