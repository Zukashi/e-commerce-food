import { IsEmail, IsOptional, IsString, Length, Max } from 'class-validator';

export class SignUpDto {
  @IsString()
  @Length(8, 20)
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(8, 20)
  readonly password: string;

  @IsString()
  @Length(8, 20)
  readonly confirm_password: string;

  @IsString()
  readonly role: 'vendor' | 'customer';
}
