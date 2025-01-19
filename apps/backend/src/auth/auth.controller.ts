import { Public } from './../common/decorators/pubulic.decorator';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { SignUpDTO } from './dto/signUp.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signUp')
  signUp(@Body() dto: SignUpDTO) {
    console.log(dto);
    return this.authService.signUp(dto);
  }

  @Public()
  @Post('signIn')
  signIn(@Body() dto: AuthDto, @Req() req, @Res() res) {
    return this.authService.signIn(dto, req, res);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  Login(@Request() req) {
    return this.authService.Login(req.user.id, req.user.name);
  }

  @Public()
  @Get('signOut')
  signOut(@Req() req, @Res() res) {
    return this.authService.signOut(req, res);
  }

  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  refresh(@Req() req) {
    return this.authService.refreshToken(req.user.id, req.user.name);
  }
}
