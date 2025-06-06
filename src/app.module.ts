import { validate } from '@/config/env.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    UserModule,
    DatabaseModule,
  ],
  controllers: [],
})
export class AppModule {}
