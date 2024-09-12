import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config'; // Importa el ConfigService

describe('EmailController', () => {
  let controller: EmailController;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [
        {
          provide: EmailService,
          useValue: {
            sendEmail: jest.fn(() => 'Email sent'), // Simula el método que quieras
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'mocked value'), // Mockea el ConfigService si es necesario
          },
        },
      ],
    }).compile();

    controller = module.get<EmailController>(EmailController);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(emailService).toBeDefined();
  });
});
