import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/users/user.entity';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User]), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
