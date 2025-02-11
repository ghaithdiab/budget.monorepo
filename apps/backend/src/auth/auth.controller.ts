import { Public } from './../common/decorators/pubulic.decorator';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/signUp.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  signUp(@Body() dto: SignUpDTO) {
    return this.authService.signUp(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signIn')
  Login(@Request() req) {
    return this.authService.signIn(req.user.id, req.user.name);
  }

  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  refresh(@Req() req) {
    return this.authService.refreshToken(req.user.id, req.user.name);
  }
}
