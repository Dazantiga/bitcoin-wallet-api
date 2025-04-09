import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

const mockUsersService = {
  findByEmail: jest.fn().mockImplementation((email) => {
    return {
      id: 1,
      email,
      password: '$2a$10$ABCDEFGHIJKLMNOPQRSTUVWXYZ012345',
      name: 'Teste'
    };
  })
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('test-token')
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
