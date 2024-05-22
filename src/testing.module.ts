import { Module } from '@nestjs/common';
import { UsersController } from './modules/users/users.controller';
import { UsersService } from 'src/modules/users/users.service';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
})
export class TestingModule {}
