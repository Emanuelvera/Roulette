import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './create.user.dto';
import { HTTP_STATUS_MESSAGES } from 'src/shared/constants';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { validate } from 'class-validator';

jest.mock('class-validator', () => ({
  validate: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user successfully', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
      username: 'test',
    };
    const user = new User();
    user.email = createUserDto.email;
    user.password = createUserDto.password;

    (validate as jest.Mock).mockResolvedValue([]);
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);
    jest.spyOn(repository, 'create').mockReturnValue(user);
    jest.spyOn(repository, 'save').mockResolvedValue(user);

    const result = await service.createUser(createUserDto);
    expect(result).toBe(HTTP_STATUS_MESSAGES.USER_CREATED_SUCCESS);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { email: createUserDto.email },
    });
    expect(repository.create).toHaveBeenCalledWith(createUserDto);
    expect(repository.save).toHaveBeenCalledWith(user);
  });

  it('should throw BadRequestException if validation fails', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
      username: 'test',
    };
    (validate as jest.Mock).mockResolvedValue([{}]);

    await expect(service.createUser(createUserDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw ConflictException if email already exists', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
      username: 'test',
    };
    const existingUser = new User();
    existingUser.email = createUserDto.email;

    (validate as jest.Mock).mockResolvedValue([]);
    jest.spyOn(repository, 'findOne').mockResolvedValue(existingUser);

    await expect(service.createUser(createUserDto)).rejects.toThrow(
      ConflictException,
    );
  });

  it('should throw unknown error if an unexpected error occurs', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
      username: 'test',
    };

    (validate as jest.Mock).mockResolvedValue([]);
    jest
      .spyOn(repository, 'findOne')
      .mockRejectedValue(new Error('Unexpected error'));

    await expect(service.createUser(createUserDto)).rejects.toThrow(
      new Error(HTTP_STATUS_MESSAGES.ERROR_UNKNOWN),
    );
  });
});
