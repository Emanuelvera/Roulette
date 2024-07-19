import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/modules/users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule],
  exports: [EmailService],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
