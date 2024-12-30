import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UserVerificationService } from './user_verification.service';
import { Public } from 'src/common/decorators/pubulic.decorator';

@Controller('user-verification')
export class UserVerificationController {
  constructor(
    private readonly userVerificationService: UserVerificationService,
  ) {}

  @Public()
  @Post('verification:userID')
  verificationOTP(
    @Param('userID', ParseIntPipe) userID: number,
    @Body() OTP: number,
  ) {
    return this.userVerificationService.verifiyOTP(userID, OTP);
  }

  @Public()
  @Post('/ReSendCode/:userId')
  resendOTP(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() email: string,
  ) {
    return this.userVerificationService.sendOTPverificationEmail(
      userId,
      (email as any).email,
    );
  }
}
