import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './create.user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and return a success message', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        username: 'test',
      };
      const result = 'User created successfully';

      jest.spyOn(usersService, 'createUser').mockResolvedValue(result);

      expect(await usersController.create(createUserDto)).toBe(result);
      expect(usersService.createUser).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw an error if the service throws an error', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        username: 'test',
      };
      const error = new Error('An error occurred');

      jest.spyOn(usersService, 'createUser').mockRejectedValue(error);

      await expect(usersController.create(createUserDto)).rejects.toThrow(
        error,
      );
    });
  });
});
