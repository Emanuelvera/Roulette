import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/users/user.entity';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/database/database.module';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User])],
})
export class AppModule {}
