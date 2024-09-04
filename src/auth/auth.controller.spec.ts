import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: JwtService;

  const mockAuthService = {
    signIn: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('fake-jwt-token'),
    verifyAsync: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: JwtService, useValue: mockJwtService },
        AuthGuard,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an access token when signIn is called with valid credentials', async () => {
    const mockToken = { access_token: 'jwt_token' };
    mockAuthService.signIn.mockResolvedValue(mockToken);

    const result = await controller.signIn({
      username: 'testuser',
      password: 'testpass',
    });

    expect(authService.signIn).toHaveBeenCalledWith('testuser', 'testpass');
    expect(result).toEqual(mockToken);
  });

  // Puedes añadir más pruebas unitarias aquí
});
