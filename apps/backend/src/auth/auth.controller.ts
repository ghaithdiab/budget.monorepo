import { Public } from './../common/decorators/pubulic.decorator';
import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signUp')
  signUp(@Body() dto: CreateUserDto) {
    console.log(dto);
    return this.authService.signUp(dto);
  }

  @Public()
  @Post('signIn')
  signIn(@Body() dto: AuthDto, @Req() req, @Res() res) {
    return this.authService.signIn(dto, req, res);
  }

  @Public()
  @Get('signOut')
  signOut(@Req() req, @Res() res) {
    return this.authService.signOut(req, res);
  }
}
