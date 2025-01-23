import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserVerificationService } from 'src/user_verification/user_verification.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerConfigModule } from '../mailerConfig/mailerConfig.module';
import jwtConfig from './config/jwt.config';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import refreshConfig from './config/refresh.config';
import { RefreshStrategy } from './strategies/refresh.token.strategy';
import verificationConfig from './config/verification.config';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshConfig),
    ConfigModule.forFeature(verificationConfig),
    MailerConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    PrismaService,
    UserVerificationService,
    ConfigService,
    JwtService,
    LocalStrategy,
    JwtStrategy,
    RefreshStrategy,
  ],
  exports: [JwtModule, JwtService],
})
export class AuthModule {}
