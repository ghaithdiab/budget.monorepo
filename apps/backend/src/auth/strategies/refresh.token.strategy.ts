import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import jwtConfig from '../config/jwt.config';
import { AuthJwtPayload } from 'src/util/types';
import refreshConfig from '../config/refresh.config';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
      secretOrKey: refreshTokenConfig.secret,
      ignoreExpiration: false,
    });
  }

  validate(payload: AuthJwtPayload) {
    const userId = payload.sub;
    return this.authService.validateReshfreshToken(userId);
  }
}
