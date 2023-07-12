import { IsEnum, IsString } from "class-validator";
import { InputType, Field } from "@nestjs/graphql";

import { CARDTYPE } from "../constants/enums.constants";

@InputType()
export class CreateCardInput {
  @IsEnum(CARDTYPE)
  @Field(() => CARDTYPE, { description: "Type of Card" })
  type: CARDTYPE;

  @IsString()
  @Field({ description: "Profile of the Card Owner" })
  profile: string;

  @IsString()
  @Field({ description: "Name of Card" })
  name: string;

  @IsString()
  @Field({ description: "Title of the Card" })
  title: string;

  @IsString()
  @Field({ description: "Description of the Card" })
  description: string;

  @IsString({ each: true })
  @Field(() => [String], { description: "Links of the Card" })
  links: string[];

  @IsString()
  @Field({ description: "User Id for Card" })
  userId: string;

  @IsString()
  @Field({ description: "Card Template Id for Card" })
  cardTemplateId: string;
}
