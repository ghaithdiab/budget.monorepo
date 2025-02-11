import { IsString } from 'class-validator';

export class UserVerificationDTO {
  @IsString()
  readonly verificationToken: string;
  @IsString()
  readonly OTP: string;
}

export class UserReverificationDTO {
  readonly email: string;
}
