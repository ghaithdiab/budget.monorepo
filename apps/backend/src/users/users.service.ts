import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserModelDb } from 'src/util/types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async GetAllUsers(): Promise<UserModelDb[]> {
    return await this.prisma.users.findMany();
  }

  async CreateUser(user: CreateUserDto): Promise<UserModelDb> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    console.log('test');
    return await this.prisma.users.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        active: true,
        verified: false,
      },
    });
  }

  async GetUser(id: number): Promise<UserModelDb> {
    return await this.prisma.users.findUnique({ where: { id: id } });
  }

  async UpdateUser(id: number, user: UpdateUserDto): Promise<UserModelDb> {
    return await this.prisma.users.update({
      where: { id: id },
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      },
    });
  }

  async DeleteUser(id: number): Promise<UserModelDb> {
    return await this.prisma.users.update({
      where: { id: id },
      data: {
        active: false,
      },
    });
  }

  async FindByEmail(email: string): Promise<UserModelDb> {
    return await this.prisma.users.findUnique({ where: { email: email } });
  }
}
