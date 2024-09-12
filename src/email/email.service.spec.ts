import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config'; // Asegúrate de importar ConfigService
import { getRepositoryToken } from '@nestjs/typeorm'; // Para mockear el UserRepository si usas TypeORM
import { User } from '../modules/users/user.entity'; // Asegúrate de que este es el UserRepository correcto

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mocked value'), // Mockear ConfigService
          },
        },
        {
          provide: getRepositoryToken(User), // Esto crea el mock del UserRepository
          useValue: {
            findOne: jest.fn(), // Mockea los métodos necesarios
            save: jest.fn(),
            // Puedes agregar más métodos mockeados si es necesario
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
