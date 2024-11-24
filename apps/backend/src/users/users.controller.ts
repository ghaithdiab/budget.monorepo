import { Controller, Get, Post, Body, Param, Patch, Delete , ParseIntPipe, ValidationPipe, UsePipes, Req, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthGuard } from 'src/common/auth/auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  

  @Get(':userId')
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  async GetAll(@Req() req) {
    return this.usersService.GetAllUsers();
  }

  @Get(':id')
  Get(@Param('id',ParseIntPipe) id: number) {
    return this.usersService.GetUser(id);
  }

  @UsePipes(ValidationPipe)
  @Post()
  async Create(@Body() user: CreateUserDto) {
    this.usersService.CreateUser(user);
  }

  @Patch(':id')
  async Update(@Param('id',ParseIntPipe) id:number , @Body() user:UpdateUserDto){
    this.usersService.UpdateUser(id, user);
  }

  @Delete(':id')
  async Delete(@Param('id', ParseIntPipe) id:number){
    this.usersService.DeleteUser(id);
  }
}
