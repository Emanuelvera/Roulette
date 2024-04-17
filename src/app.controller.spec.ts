import { Test } from '@nestjs/testing';
import { UsersController } from './modules/users/users.controller';
import { UsersService } from './modules/users/users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    usersController = moduleRef.get<UsersController>(UsersController);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [
        {
          id: 1,
          username: 'test',
          email: 'test@example.com',
          password: 'password',
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLogin: null,
        },
      ];
      jest.spyOn(usersService, 'findAll').mockResolvedValue(result);
      expect(await usersController.findAll()).toBe(result);
    });
  });
});
