import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './users/database.module';
import { User } from './users/user.entity';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User])],
})
export class AppModule {}
