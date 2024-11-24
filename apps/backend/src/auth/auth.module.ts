import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserVerificationService } from 'src/user_verification/user_verification.service';
import { ConfigService } from '@nestjs/config';
import {MailerConfigModule} from '../mailerConfig/mailerConfig.module'


@Module({
  imports:[
    JwtModule.register({
      secret : process.env.JWT_SECRET_KEY,
      signOptions : {expiresIn : process.env.JWT_EXPIRE_TIME}
    }),
    MailerConfigModule],
  controllers: [AuthController],
  providers: [AuthService,UsersService,PrismaService,UserVerificationService,ConfigService,JwtService],
  exports :[JwtModule,JwtService]
})
export class AuthModule {}
