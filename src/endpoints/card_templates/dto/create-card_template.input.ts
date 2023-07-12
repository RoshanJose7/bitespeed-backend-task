import { IsString } from "class-validator";
import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreateCardTemplateInput {
  @IsString()
  @Field({ description: "CSS Styles For Card Template" })
  style: string;

  @IsString()
  @Field({ description: "Color for Card Template" })
  color: string;

  @IsString({
    each: true,
  })
  @Field(() => [String], {
    description: "Valid links for Card Template",
  })
  linkIds: string[];
}
