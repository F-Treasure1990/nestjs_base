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
import { ResponseMessage } from '@/common/decorators/response-message.decorator';

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
  @ResponseMessage('Users Fetched Successfully')
  findAll() {
    const users = this.userService.findAll();
    return this.userMapper.omit(users);
  }

  @Get(':id')
  @ResponseMessage('User Fetched Successfully')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
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
