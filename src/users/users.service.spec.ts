import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { getModelToken } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from './entities/user.entity'
import { AuthService } from '../auth/auth.service'

// Mock do modelo User
const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn()
};

// Mock do AuthService
const mockAuthService = {
  auth: jest.fn().mockImplementation((user) => {
    return {
      access_token: 'teste-token'
    };
  }),
  validatePassword: jest.fn()
};

describe('UsersService', () => {
  let service: UsersService
  let model: Model<User>
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel
        },
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ]
    }).compile()

    service = module.get<UsersService>(UsersService)
    model = module.get<Model<User>>(getModelToken('User'))
    authService = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
