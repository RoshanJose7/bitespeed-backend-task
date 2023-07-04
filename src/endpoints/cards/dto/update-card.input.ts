import { InputType, Field, PartialType } from "@nestjs/graphql";

import { CreateCardInput } from "./create-card.input";

@InputType()
export class UpdateCardInput extends PartialType(CreateCardInput) {
  @Field({ description: "Id of card to be updated" })
  id: string;
}
