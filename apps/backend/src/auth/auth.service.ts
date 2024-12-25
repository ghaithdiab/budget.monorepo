import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
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
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private UserverificationService: UserVerificationService,
    private usersService: UsersService,
  ) {}

  async signUp(userDto: CreateUserDto) {
    console.log(userDto);
    const user = await this.usersService.FindByEmail(userDto.email);
    if (user) throw new ConflictException('Email already existe');
    const newUser = await this.usersService.CreateUser(userDto);
    console.log(newUser);
    const emailSended =
      await this.UserverificationService.sendOTPverificationEmail(
        newUser.id,
        newUser.email,
      );
    if (emailSended.accepted?.length > 0) {
      return {
        message: 'Signup was  succeful email verification was sended',
        user: newUser,
      };
    }
    return { message: 'Signup was  succeful', user: newUser };
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
}
