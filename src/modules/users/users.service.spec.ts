import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './create.user.dto';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { validate } from 'class-validator';
import { EmailService } from 'src/email/email.service';
import { HTTP_STATUS_MESSAGES } from 'src/shared/constants';

jest.mock('class-validator', () => ({
  validate: jest.fn(),
}));

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockEmailService = {
  sendWelcomeEmail: jest.fn(),
  sendVerificationEmail: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    let createUserDto: CreateUserDto;
    let user: User;

    beforeEach(() => {
      createUserDto = {
        email: 'test@example.com',
        password: 'password',
        username: 'test',
      };
      user = new User();
      user.email = createUserDto.email;
      user.password = createUserDto.password;
    });

    it('should create a user successfully', async () => {
      (validate as jest.Mock).mockResolvedValue([]);
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(user);
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      const result = await service.createUser(createUserDto);

      expect(result).toEqual(HTTP_STATUS_MESSAGES.USER_CREATED_SUCCESS); // Ajusta la expectativa a la cadena de éxito
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(user);
    });

    it('should throw BadRequestException if validation fails', async () => {
      (validate as jest.Mock).mockResolvedValue([
        { constraints: { isEmail: 'email must be an email' } }, // Simula errores de validación
      ]);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ConflictException if email already exists', async () => {
      const existingUser = new User();
      existingUser.email = createUserDto.email;

      (validate as jest.Mock).mockResolvedValue([]);
      jest.spyOn(repository, 'findOne').mockResolvedValue(existingUser);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw an unknown error if an unexpected error occurs', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockRejectedValue(new Error('Unexpected error'));
      -(await expect(service.createUser(createUserDto)).rejects.toThrow(
        new BadRequestException(HTTP_STATUS_MESSAGES.ERROR_UNKNOWN),
      ));
    });
  });
});
