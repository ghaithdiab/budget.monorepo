import { Injectable } from '@nestjs/common';
import { UsersModule } from './users.module';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async GetAllUsers(): Promise<UsersModule[]> {
    return await this.prisma.users.findMany();
  }

  async CreateUser(user: CreateUserDto): Promise<UsersModule> {
    return await this.prisma.users.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        active: true,
        verified: user.role == Role.ADMIN  
      },
    });
  }

  async GetUser(id:number):Promise<UsersModule>{
    return await this.prisma.users.findUnique({where:{id:id}})
  }

  async UpdateUser(id:number , user:UpdateUserDto):Promise<UsersModule>{
    return await this.prisma.users.update({
      where: { id: id },
      data:{
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        
      }
    }
  )
  }

  async DeleteUser(id:number):Promise<UsersModule>{
    return await this.prisma.users.update({
      where: { id: id },
      data:{
        active:false
      }
    })
  }
}
