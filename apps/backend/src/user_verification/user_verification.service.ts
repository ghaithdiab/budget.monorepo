import { PrismaService } from 'src/prisma.service';
import { ConfigService, ConfigType } from '@nestjs/config';
import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import verificationConfig from './config/verification.config';
import { VerificationJwtPayload } from 'src/util/types';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserVerificationService {
  constructor(
    private ConfigService: ConfigService,
    private PrismaService: PrismaService,
    private readonly mailerService: MailerService,
    private jwtService: JwtService,
    @Inject(verificationConfig.KEY)
    private verificationTokenConfig: ConfigType<typeof verificationConfig>,
    @Inject(forwardRef(() => AuthService))
    private readonly AuthService: AuthService,
  ) {}

  async sendOTPverificationEmail(userId: number, email: string) {
    try {
      const OTP = Math.floor(1000 + Math.random() * 9000);
      const emailOptions: ISendMailOptions = {
        from: {
          name: this.ConfigService.get<string>('APP_NAME'),
          address: this.ConfigService.get<string>('EMAIL_USER'),
        },
        to: email,
        subject: `OTP Verification`,
        html: `<p>Your OTP is <b>${OTP}</b></p>
      <p><b>This code expire in 15 minuts</b></p>`,
      };
      // hash the opt
      const hashedOTP = await bcrypt.hash(OTP.toString(), 10);
      const userExisteInVerification = await this.getVerificationRecord(userId);
      if (userExisteInVerification) {
        await this.PrismaService.user_Verification.update({
          where: { userId: userId },
          data: {
            code: hashedOTP,
            isVerified: false,
            createdAt: new Date(),
            expiredAt: new Date(Date.now() + 360000),
          },
        });
      } else {
        await this.PrismaService.user_Verification.create({
          data: {
            userId: userId,
            code: hashedOTP,
            isVerified: false,
            createdAt: new Date(),
            expiredAt: new Date(Date.now() + 360000),
            email: email,
          },
        });
      }
      const messageInfo = await this.mailerService.sendMail(emailOptions);
      return {
        messageInfo: messageInfo,
        OTP: OTP,
      };
    } catch (err) {
      console.log(err);
    }
  }

  async verifiyOTP(userID: number, OTP: number): Promise<boolean> {
    const userVerification =
      await this.PrismaService.user_Verification.findUnique({
        where: {
          userId: userID,
          isVerified: false,
        },
      });
    if (!userVerification) throw new BadRequestException('user not found');
    if (userVerification.expiredAt < new Date())
      throw new BadRequestException('Your code has been expired');
    const isMatch = await bcrypt.compareSync(
      OTP.toString(),
      userVerification.code,
    );
    if (!isMatch) throw new BadRequestException('Invalid OTP');
    await this.PrismaService.users.update({
      where: { id: userID },
      data: {
        verified: isMatch,
      },
    });
    await this.PrismaService.user_Verification.delete({
      where: { userId: userID },
    });
    return false;
  }

  async verifiyOTPV2(userID: number, OTP: number) {
    const userVerification = await this.getVerificationRecord(userID);
    if (!userVerification) throw new BadRequestException('user not found');
    const isMatch = await bcrypt.compareSync(
      OTP.toString(),
      userVerification.code,
    );
    if (!isMatch) throw new BadRequestException('Invalid OTP');
    const user = await this.PrismaService.users.update({
      where: { id: userID },
      data: {
        verified: isMatch,
      },
    });
    const { accessToken, refreshToken } =
      await this.AuthService.generateToken(userID);

    return {
      id: user.id,
      name: user.name,
      accessToken,
      refreshToken,
    };
  }

  async getVerificationRecord(userId: number) {
    return this.PrismaService.user_Verification.findUnique({
      where: {
        userId: userId,
      },
    });
  }

  async ValidateVerificationToken(userId: number) {
    //TODO delete expiredAt From modul not usfull if JwT has expired
    const userVerificatin = await this.getVerificationRecord(userId);
    if (!userVerificatin)
      throw new HttpException(
        'error while create validation system',
        HttpStatus.NOT_FOUND,
      );
    return {
      id: userVerificatin.userId,
    };
    // if(userVerificatin.expiredAt < new Date()) throw new HttpException('Token expired',HttpStatus.BAD_REQUEST);
    // const isMatch = await bcrypt.compare(OTP?.toString(), userVerificatin.code);
    // if (!isMatch)
    //   throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    // return {
    //   id: userVerificatin.id,
    //   email: userVerificatin.email,
    // };
  }

  async generateVerificcationToken(userId: number, OTP: number) {
    const payload: VerificationJwtPayload = {
      userID: userId,
    };
    console.log(this.verificationTokenConfig);
    const verificationToken = await this.jwtService.signAsync(
      payload,
      this.verificationTokenConfig,
    );
    console.log(verificationToken);
    return verificationToken;
  }
}
