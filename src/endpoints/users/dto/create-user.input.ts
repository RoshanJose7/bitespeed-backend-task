import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsNumberString,
} from "class-validator";
import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreateUserInput {
  @IsString()
  @Field({ description: "Full Name of the User" })
  name: string;

  @IsEmail()
  @IsOptional()
  @Field({ description: "Email of the User" })
  email?: string;

  @IsNumberString({
    no_symbols: true,
  })
  @MinLength(9)
  @Field({ description: "Phone Number of the User" })
  phoneNumber: string;
}
