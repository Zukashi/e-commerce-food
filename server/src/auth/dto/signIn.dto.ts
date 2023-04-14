import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class SignInDto {
  @IsString()
  @Length(8, 20)
  @IsOptional()
  readonly username?: string;
  @IsEmail()
  @IsOptional()
  readonly email?: string;
  @IsString()
  @Length(8, 20)
  readonly password: string;
}
