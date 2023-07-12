import { IsString } from "class-validator";
import { InputType, Field, PartialType } from "@nestjs/graphql";

import { CreateCardTemplateLinkInput } from "./create-card_template_link.input";

@InputType()
export class UpdateCardTemplateLinkInput extends PartialType(
  CreateCardTemplateLinkInput,
) {
  @IsString()
  @Field()
  id: string;
}
