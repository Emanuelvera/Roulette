import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { validate } from 'class-validator';
import { EmailService } from 'src/email/email.service';
import { HTTP_STATUS_MESSAGES } from 'src/shared/constants';
import { UsersService } from 'src/modules/users/users.service';
import { User } from 'src/modules/users/user.entity';
import { CreateUserDto } from 'src/modules/users/create.user.dto';

// Asegúrate de que `validate` está correctamente mockeado
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

      expect(result).toEqual(HTTP_STATUS_MESSAGES.USER_CREATED_SUCCESS); // Aquí debes comparar con el mensaje correcto
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

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        new BadRequestException(HTTP_STATUS_MESSAGES.ERROR_UNKNOWN),
      );
    });
  });
});
