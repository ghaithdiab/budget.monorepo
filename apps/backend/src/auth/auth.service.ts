import { PrismaService } from 'src/prisma.service';
import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { UserVerificationService } from 'src/user_verification/user_verification.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService : JwtService,
    private UserverificationService: UserVerificationService
  ){}



  async signUp(dto:AuthDto){
    const {email , password} = dto;
    const user = await this.prisma.users.findUnique({where:{email}});
    if(user) throw new BadRequestException('Email already existe');
    const hashedPassword = await bcrypt.hash(password , 10);
    const newUser = await this.prisma.users.create(
      {
        data:{
          name:'',
          email:email,
          password:hashedPassword
          
        }
    });
   const emailSended =  await this.UserverificationService.sendOTPverificationEmail(newUser.id, newUser.email);
   if(emailSended.accepted?.length>0){
      return {message : 'Signup was  succeful email verification was sended', user: newUser}
   }
    return {message : 'Signup was  succeful', user: newUser};
  } 
  async signIn(dto : AuthDto ,Req: Request , Res: Response){
    const {email , password} = dto;
    const user = await this.prisma.users.findUnique({where:{email}});
    if(!user) throw new BadRequestException('Account not existe');

    const isMatch= await this.comparePassword(password , user.password);
    if(!isMatch) throw new UnauthorizedException();

    const token =await this.signToken(user.id, user.email);
    if(!token) throw new ForbiddenException();
    // Res.cookie('token',token);
    Res.send({message : 'Loggin successfuly',token})
  }

  async signOut(req:Request,res:Response){
    // implement sign out logic here 
    // res.clearCookie('token');
    res.send({message : 'Sign out successfuly'})

  }

  async comparePassword(password:string, hash:string){
    return await bcrypt.compare(password, hash);
  }


  async signToken(id:number, email:string){
    const payload = {id , email};
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    // const jwtExpireTime = process.env.JWT_EXPIRE_TIME;
    const token = await this.jwtService.signAsync(payload,{secret:jwtSecretKey});
    return token;

  }

}
