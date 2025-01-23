import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserVerificationService {
  constructor(
    private ConfigService: ConfigService,
    private PrismaService: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  async sendOTPverificationEmail(userId: number, email: string) {
    try {
      const OTP = `${Math.floor(1000 + Math.random() * 9000)}`;
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
      const hashedOTP = await bcrypt.hash(OTP, 10);
      const userExisteInVerification =
        await this.PrismaService.user_Verification.findUnique({
          where: { userId: userId },
        });
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
        hashedOTP: hashedOTP,
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
}
