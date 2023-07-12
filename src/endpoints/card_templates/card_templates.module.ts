import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { registerEnumType } from "@nestjs/graphql";

import { CardTemplate } from "./entities/card_template.entity";
import { CardTemplateEnums } from "./constants/enums.constants";
import { CardTemplatesService } from "./card_templates.service";
import { CardTemplatesResolver } from "./card_templates.resolver";
import { CardTemplateLink } from "./entities/card_template_link.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CardTemplate, CardTemplateLink])],
  providers: [CardTemplatesResolver, CardTemplatesService],
  exports: [CardTemplatesService],
})
export class CardTemplatesModule {
  constructor() {
    for (let i = 0; i < CardTemplateEnums.length; i++) {
      registerEnumType(CardTemplateEnums[i].enum, {
        name: CardTemplateEnums[i].name,
      });
    }
  }
}
