import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';

// Mock do AuthService
const mockAuthService = {
  auth: jest.fn().mockImplementation((user) => {
    return {
      access_token: 'teste-token'
    };
  }),
};

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello user from bitcoin wallet api"', () => {
      expect(appController.getHello()).toBe('Hello user from bitcoin wallet api');
    });
  });
});
