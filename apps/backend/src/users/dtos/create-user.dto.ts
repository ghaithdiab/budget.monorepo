import { Role } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  // @Length(2, null, { message: 'name not valide' })
  readonly name?: string;
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
  @IsNotEmpty()
  readonly password: string;
  readonly birthday?: Date;
  readonly role?: Role;
  readonly verified?: boolean;
}
