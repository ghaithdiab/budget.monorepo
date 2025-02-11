import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserVerificationService } from './user_verification.service';
import { Public } from 'src/common/decorators/pubulic.decorator';
import { VerificationJwtGuard } from './guards/verificationJwtGuard/verificationJwtGuard';
import { UserVerificationDTO } from './dto/user_verification.dto';

@Controller('user-verification')
export class UserVerificationController {
  constructor(
    private readonly userVerificationService: UserVerificationService,
  ) {}

  // @Public()
  @UseGuards(VerificationJwtGuard)
  @Post('verification')
  verificationOTP(
    @Req() req,
    @Body() userVerificationDTO: UserVerificationDTO,
  ) {
    return this.userVerificationService.verifiyOTPV2(
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
