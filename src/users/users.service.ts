import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    const options: FindOneOptions<User> = {
      where: { id },
    };
    return this.usersRepository.findOne(options);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
