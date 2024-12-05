import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/users/user.entity';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { GroupsModule } from './groups/groups.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User]),
    UsersModule,
    EmailModule,
    ConfigModule.forRoot(),
    AuthModule,
    GroupsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
