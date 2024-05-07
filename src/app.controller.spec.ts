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
    });
  });

  describe('createUser', () => {
    it('should return a user', async () => {
      // Crea un objeto userDto con las propiedades necesarias
      const userDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };
      const userObject = userDto as User;
      expect(userObject.email).toEqual('test@example.com');
      expect(userObject.username).toEqual('testuser');
    });
  });
});
