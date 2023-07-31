import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";

export class IdentifyContactDto {
	@IsString()
	@MaxLength(10)
	@IsOptional()
	phoneNumber?: string;

	@IsEmail()
	@IsOptional()
	email?: string;
}
