import { IsString } from "class-validator";
import { InputType, Field, PartialType } from "@nestjs/graphql";

import { CreateCardTemplateInput } from "./create-card_template.input";

@InputType()
export class UpdateCardTemplateInput extends PartialType(
  CreateCardTemplateInput,
) {
  @IsString()
  @Field()
  id: string;
}
