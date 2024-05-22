import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './modules/users/users.controller';
import { UsersService } from './modules/users/users.service';
import { CreateUserDto } from './modules/users/create.user.dto';
import { User } from './modules/users/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(() => []),
            createUser: jest.fn(
              (dto: CreateUserDto): Promise<User | string> => {
                return Promise.resolve({
                  id: 1,
                  email: dto.email,
                  username: dto.username,
                  password: dto.password,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  lastLogin: new Date(),
                } as User);
              },
            ),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = await controller.findAll();
      expect(users).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should return a user', async () => {
      const userDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      const result = await controller.create(userDto);

      if (typeof result === 'string') {
        // Si se devuelve un string, lanza un error para indicar que no es el caso esperado en esta prueba
        throw new Error(`Unexpected string result: ${result}`);
      }

      expect(result).toEqual({
        id: 1,
        email: userDto.email,
        username: userDto.username,
        password: userDto.password,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        lastLogin: expect.any(Date),
      });
      expect(service.createUser).toHaveBeenCalledWith(userDto);
    });
  });
});
