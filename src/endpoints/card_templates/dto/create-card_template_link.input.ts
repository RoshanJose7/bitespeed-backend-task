import { IsEnum, IsString } from "class-validator";
import { InputType, Field } from "@nestjs/graphql";

import { CARDTEMPLATELINKTYPE } from "../constants/enums.constants";

@InputType()
export class CreateCardTemplateLinkInput {
  @IsEnum(CARDTEMPLATELINKTYPE)
  @Field(() => CARDTEMPLATELINKTYPE, {
    description: "Type of Card Template Link",
  })
  type: CARDTEMPLATELINKTYPE;

  @IsString()
  @Field({ description: "Icon for Card Template Link" })
  icon: string;

  @IsString({ each: true })
  @Field(() => [String], { description: "Links for Card Template Link" })
  links: string[];
}
