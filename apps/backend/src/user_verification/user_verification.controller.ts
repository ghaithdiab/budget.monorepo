import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserVerificationService } from './user_verification.service';
import { VerificationJwtGuard } from './guards/verificationJwtGuard/verificationJwtGuard';
import { UserVerificationDTO } from './dto/user_verification.dto';

@Controller('user-verification')
export class UserVerificationController {
  constructor(
    private readonly userVerificationService: UserVerificationService,
  ) {}

  @UseGuards(VerificationJwtGuard)
  @Post('verification')
  verificationOTP(
    @Req() req,
    @Body() userVerificationDTO: UserVerificationDTO,
  ) {
    return this.userVerificationService.verifiyOTP(
      req.user.id,
      parseInt(userVerificationDTO.OTP),
    );
  }

  // @Public()
  // @Post('/ReSendCode/:userId')
  // resendOTP(
  //   @Param('userId', ParseIntPipe) userId: number,
  //   @Body() email: string,
  // ) {
  //   return this.userVerificationService.sendOTPverificationEmail(
  //     userId,
  //     (email as any).email,
  //   );
  // }
}
