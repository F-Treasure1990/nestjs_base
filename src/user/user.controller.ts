import { UserMapper } from '@/user/user.mapper';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return this.userMapper.omit(user);
  }

  @Get()
  findAll() {
    const users = this.userService.findAll();
    return this.userMapper.omit(users);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      response: this.userService.findOne(id),
      message: 'User Fetched Successfully',
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // throw new Error('Method not implemented.');
    throw new UnauthorizedException('Method not implemented.');
    return this.userService.remove(+id);
  }
}
