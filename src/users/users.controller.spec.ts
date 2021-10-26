import { HttpException, HttpStatus } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

const mockUserService = {
  create: jest.fn(dto => Promise.resolve())
}

const mockCreateDTO = {
  firstName: 'Valid_first_name',
  lastName: 'Valid_second_name',
  email: 'valid@mail.com',
  password: 'valid_password'
}

describe('UsersController', () => {
  let sut: UsersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService]
    })
    .overrideProvider(UsersService)
    .useValue(mockUserService)
    .compile()

    sut = module.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  describe('create', () => {
    it('should returns a User on success', async () => {
      expect(sut.create(mockCreateDTO)).toStrictEqual(Promise.resolve())
    })

    it('should return httpException if user with email already exists', async () => {
      jest.spyOn(sut, 'create').mockRejectedValueOnce(new HttpException('user with email already exists', HttpStatus.BAD_REQUEST))
      expect(sut.create(mockCreateDTO)).rejects.toStrictEqual(new HttpException('user with email already exists', HttpStatus.BAD_REQUEST))
    })
  })
})
