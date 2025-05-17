import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '@/database/database.module';
import { UserMapper } from '@/user/user.mapper';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, UserMapper],
})
export class UserModule {}
