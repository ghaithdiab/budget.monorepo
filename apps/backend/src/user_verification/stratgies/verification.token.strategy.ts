import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { Strategy } from 'passport-local';
import { AuthService } from '../../auth/auth.service';
import { AuthJwtPayload, VerificationJwtPayload } from 'src/util/types';
import verificationConfig from '../config/verification.config';
import { UserVerificationService } from 'src/user_verification/user_verification.service';
// import { ExtractJwt } from 'passport-jwt';

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
    console.log('VerificationTokenStrategy initialized');
  }

  async validate(payload: VerificationJwtPayload) {
    return this.userVerificationService.ValidateVerificationToken(
      payload.userID,
    );
  }
}
