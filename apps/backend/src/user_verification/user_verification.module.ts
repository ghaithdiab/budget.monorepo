import { forwardRef, Module } from '@nestjs/common';
import { UserVerificationController } from './user_verification.controller';
import { UserVerificationService } from './user_verification.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import verificationConfig from './config/verification.config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { VerificationTokenStrategy } from './stratgies/verification.token.strategy';
import { VerificationJwtGuard } from './guards/verificationJwtGuard/verificationJwtGuard';
import jwtConfig from 'src/auth/config/jwt.config';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [
    JwtModule.registerAsync(verificationConfig.asProvider()),
    ConfigModule,
    ConfigModule.forFeature(verificationConfig),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserVerificationController],
  providers: [
    UserVerificationService,
    JwtService,
    PrismaService,
    VerificationTokenStrategy,
    VerificationJwtGuard,
  ],
  exports: [UserVerificationService],
})
export class UserVerificationModule {}
