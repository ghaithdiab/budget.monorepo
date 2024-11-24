import { IsEmail, IsNotEmpty, IsString } from 'class-validator';


export class AuthDto{
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  readonly email:string;

  @IsNotEmpty()
  @IsString()
  // @Length(8,20, {message : 'password must be at least 8 chares' })
  readonly password:string;
}