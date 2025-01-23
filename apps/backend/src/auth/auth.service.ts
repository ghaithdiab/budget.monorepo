import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { UserVerificationService } from 'src/user_verification/user_verification.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { SignUpDTO } from './dto/signUp.dto';
import { AuthJwtPayload, VerificationJwtPayload } from 'src/util/types';
import refreshConfig from './config/refresh.config';
import { ConfigType } from '@nestjs/config';
import verificationConfig from './config/verification.config';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private UserverificationService: UserVerificationService,
    private usersService: UsersService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
    @Inject(verificationConfig.KEY)
    private verificationTokenConfig: ConfigType<typeof verificationConfig>,
  ) {}

  async signUp(userDto: SignUpDTO) {
    console.log(userDto);
    const user = await this.usersService.FindByEmail(userDto.email);
    if (user) throw new ConflictException('Email already existe');
    const newUser = await this.usersService.CreateUser(userDto);
    if (!newUser) throw new BadRequestException('user creation faild');
    const { messageInfo, hashedOTP } =
      await this.UserverificationService.sendOTPverificationEmail(
        newUser.id,
        newUser.email,
      );
    if (messageInfo.accepted?.length > 0) {
      console.log(newUser);
      const verificationToken = await this.generateVerificcationToken(
        newUser.id,
        hashedOTP,
      );

      return {
        id: newUser.id,
        verificationToken,
      };
    }
    throw new BadRequestException('email send failed');
  }
  async signIn(dto: AuthDto, Req: Request, Res: Response) {
    const { email, password } = dto;
    const user = await this.usersService.FindByEmail(email);
    if (!user) throw new BadRequestException('Account not existe');

    const isMatch = await this.comparePassword(password, user.password);
    if (!isMatch) throw new UnauthorizedException();

    const token = await this.signToken(user.id, user.email);
    if (!token) throw new ForbiddenException();
    // Res.cookie('token',token);
    Res.send({ message: 'Loggin successfuly', token });
  }

  async signOut(req: Request, res: Response) {
    // implement sign out logic here
    // res.clearCookie('token');
    res.send({ message: 'Sign out successfuly' });
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

  async Login(userId: number, name?: string) {
    const { accessToken, refreshToken } = await this.generateToken(userId);
    return {
      id: userId,
      name: name,
      accessToken,
      refreshToken,
    };
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

  async generateVerificcationToken(userId: number, hashedOTP: string) {
    const payload: VerificationJwtPayload = {
      userID: userId,
      hashedOTP: hashedOTP,
    };
    console.log(this.verificationTokenConfig);
    const verificationToken = await this.jwtService.signAsync(
      payload,
      this.verificationTokenConfig,
    );
    console.log(verificationToken);
    return verificationToken;
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
