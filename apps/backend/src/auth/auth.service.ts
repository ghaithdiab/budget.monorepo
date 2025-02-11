import {
  BadRequestException,
  ConflictException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserVerificationService } from 'src/user_verification/user_verification.service';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { SignUpDTO } from './dto/signUp.dto';
import { AuthJwtPayload } from 'src/util/types';
import refreshConfig from './config/refresh.config';
import { ConfigType } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => UserVerificationService))
    private readonly userverificationService: UserVerificationService,
    private usersService: UsersService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}

  async signUp(userDto: SignUpDTO) {
    const user = await this.usersService.FindByEmail(userDto.email);
    if (user) throw new ConflictException('Email already existe');
    const newUser = await this.usersService.CreateUser(userDto);
    if (!newUser) throw new BadRequestException('user creation faild');
    const { messageInfo, OTP } =
      await this.userverificationService.sendOTPverificationEmail(
        newUser.id,
        newUser.email,
      );
    if (messageInfo.accepted?.length > 0) {
      const verificationToken =
        await this.userverificationService.generateVerificcationToken(
          newUser.id,
          OTP,
        );

      return {
        id: newUser.id,
        verificationToken,
      };
    }
    throw new BadRequestException('email send failed');
  }

  async signIn(userId: number, name?: string) {
    const { accessToken, refreshToken } = await this.generateToken(userId);
    return {
      id: userId,
      name: name,
      accessToken,
      refreshToken,
    };
  }

  async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async signToken(id: number, email: string) {
    const payload = { id, email };
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    // const jwtExpireTime = process.env.JWT_EXPIRE_TIME;
    const token = await this.jwtService.signAsync(payload, {
      secret: jwtSecretKey,
    });
    return token;
  }

  async generateToken(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY,
      }),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);
    return { accessToken, refreshToken };
  }

  async validateJwtUser(userId: number) {
    const user = await this.usersService.GetUser(userId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return { id: user.id };
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.usersService.FindByEmail(email);
    if (!user) throw new UnauthorizedException('user not found');

    const isMatch = await this.comparePassword(password, user.password);
    if (!isMatch) throw new UnauthorizedException('email or password mismatch');
    return {
      id: user.id,
      name: user.name,
    };
  }

  async validateReshfreshToken(userId: number) {
    const user = await this.usersService.GetUser(userId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return { id: user.id };
  }

  async refreshToken(userId: number, name: string) {
    const { accessToken, refreshToken } = await this.generateToken(userId);
    return {
      id: userId,
      name: name,
      accessToken,
      refreshToken,
    };
  }
}
