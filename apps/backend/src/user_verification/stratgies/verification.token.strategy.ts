import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { VerificationJwtPayload } from 'src/util/types';
import verificationConfig from '../config/verification.config';
import { UserVerificationService } from 'src/user_verification/user_verification.service';

@Injectable()
export class VerificationTokenStrategy extends PassportStrategy(
  Strategy,
  'verification-jwt',
) {
  constructor(
    @Inject(verificationConfig.KEY)
    private verificationTokenConfig: ConfigType<typeof verificationConfig>,
    private userVerificationService: UserVerificationService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('verificationToken'),
      secretOrKey: verificationTokenConfig.secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: VerificationJwtPayload) {
    return this.userVerificationService.ValidateVerificationToken(
      payload.userID,
    );
  }
}
