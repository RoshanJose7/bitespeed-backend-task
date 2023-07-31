import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

import { LinkPrecedence } from "../../utils/enums";

export class CreateContactDto {
  @IsString()
  @MaxLength(10)
  @IsOptional()
  phoneNumber?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNumber()
  @IsOptional()
  linkedId?: number;

  @IsEnum(LinkPrecedence)
  @IsOptional()
  linkedPrecedence?: LinkPrecedence;
}
