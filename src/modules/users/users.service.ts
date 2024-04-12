import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './create.user.dto';
import { validate } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const errors = await validate(createUserDto);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const newUser = this.usersRepository.create(createUserDto);
    const user = await this.usersRepository.save(newUser);
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    const options: FindOneOptions<User> = {
      where: { id },
    };
    return this.usersRepository.findOne(options);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const options: FindOneOptions<User> = {
      where: { email },
    };
    return this.usersRepository.findOne(options);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
