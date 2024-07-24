import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  /*Param,*/ Post,
} from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './create.user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/findAll')
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post('/')
  create(@Body() createUserDto: CreateUserDto): Promise<User | string> {
    return this.usersService.createUser(createUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.usersService.deleteUser(id);
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(+id);
  }
}
