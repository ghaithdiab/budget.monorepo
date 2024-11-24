import { Role } from "@prisma/client";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto{
  @IsString()
  @Length(2,null,{message:'name not valide'})
  readonly name:string;
  @IsEmail()
  readonly email:string;
  readonly password:string;
  readonly birthday:Date;
  readonly role :Role;
  readonly verified: boolean;
}

