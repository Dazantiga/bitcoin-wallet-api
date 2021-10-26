import { HttpException, HttpStatus } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { TransactionsController } from './transactions.controller'
import { TransactionsService } from './transactions.service'

const mockTransactionService = {
  create: jest.fn(dto => Promise.resolve()),
  findAll: jest.fn(userId => Promise.resolve([mockTransactions, mockTransactions, mockTransactions])),
  findOne: jest.fn(id => Promise.resolve(mockTransactions)),
  update: jest.fn((id, dto) => Promise.resolve()),
  remove: jest.fn(id => Promise.resolve())
}

const mockDTO = {
  valueInvested: 500.00,
  btcbToBrl: 345400.47,
  bitcoinQuantity: 0.0014372,
  date: '23/10/2021',
  userId: null
}

const mockReq = {
  user: {
    id: 'valid_id'
  }
}

const mockTransactions = {
  valueInvested: 500.00,
  btcbToBrl: 345400.47,
  bitcoinQuantity: 0.0014372,
  date: '23/10/2021',
  userId: 'valid_id'
}

describe('TransactionsController', () => {
  let sut: TransactionsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [TransactionsService]
    })
      .overrideProvider(TransactionsService)
      .useValue(mockTransactionService)
      .compile()

    sut = module.get<TransactionsController>(TransactionsController)
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  describe('create', () => {
    it('should return promise void on sucess', async () => {
      expect(sut.create(mockDTO, mockReq)).toStrictEqual(Promise.resolve())
    })

    it('should return httpException if invalid userId is provided', async () => {
      const mockReqWithInvalidUserId = { user: { id: 'invalid_id' } }
      jest.spyOn(sut, 'create').mockRejectedValueOnce(new HttpException('user id provided is invalid', HttpStatus.BAD_REQUEST))
      expect(sut.create(mockDTO, mockReqWithInvalidUserId)).rejects.toStrictEqual(new HttpException('user id provided is invalid', HttpStatus.BAD_REQUEST))
    })
  })

  describe('findAll', () => {
    it('should returns a list of user transactions', async () => {
      expect(sut.findAll(mockReq)).toStrictEqual(Promise.resolve([mockTransactions, mockTransactions, mockTransactions]))
    })

    it('should return httpException if invalid userId is provided', async () => {
      const mockReqWithInvalidUserId = { user: { id: 'invalid_id' } }
      jest.spyOn(sut, 'findAll').mockRejectedValueOnce(new HttpException('user id provided is invalid', HttpStatus.BAD_REQUEST))
      expect(sut.findAll(mockReqWithInvalidUserId)).rejects.toStrictEqual(new HttpException('user id provided is invalid', HttpStatus.BAD_REQUEST))
    })
  })

  describe('findOne', () => {
    it('should return a transaction', async () => {
      expect(sut.findOne('valid_id')).toStrictEqual(Promise.resolve(mockTransactions))
    })

    it('should return httpException if invalid userId is provided', async () => {
      jest.spyOn(sut, 'findOne').mockRejectedValueOnce(new HttpException('user id provided is invalid', HttpStatus.BAD_REQUEST))
      expect(sut.findOne('invalid_id')).rejects.toStrictEqual(new HttpException('user id provided is invalid', HttpStatus.BAD_REQUEST))
    })

    it('should return httpException if transaction of user not found', async () => {
      jest.spyOn(sut, 'findOne').mockRejectedValueOnce(new HttpException('transaction not found', HttpStatus.NOT_FOUND))
      expect(sut.findOne('invalid_id')).rejects.toStrictEqual(new HttpException('transaction not found', HttpStatus.NOT_FOUND))
    })
  })

  describe('update', () => {
    it('should return promise void on sucess', async () => {
      expect(sut.update('valid_id', mockDTO, mockReq)).toStrictEqual(Promise.resolve())
    })

    it('should return httpException if invalid is provided', async () => {
      jest.spyOn(sut, 'update').mockRejectedValueOnce(new HttpException('id provided is invalid', HttpStatus.BAD_REQUEST))
      expect(sut.update('invalid_id', mockDTO, mockReq)).rejects.toStrictEqual(new HttpException('id provided is invalid', HttpStatus.BAD_REQUEST))
    })

    it('should return httpException if transaction not found', async () => {
      jest.spyOn(sut, 'update').mockRejectedValueOnce(new HttpException('transaction not found', HttpStatus.NOT_FOUND))
      expect(sut.update('invalid_id', mockDTO, mockReq)).rejects.toStrictEqual(new HttpException('transaction not found', HttpStatus.NOT_FOUND))
    })
  })

  describe('delete', () => {
    it('should return promise void on sucess', async () => {
      expect(sut.remove('valid_id')).toStrictEqual(Promise.resolve())
    })

    it('should return httpException if invalid id is provided', async () => {
      jest.spyOn(sut, 'remove').mockRejectedValueOnce(new HttpException('id provided is invalid', HttpStatus.BAD_REQUEST))
      expect(sut.remove('invalid_id')).rejects.toStrictEqual(new HttpException('id provided is invalid', HttpStatus.BAD_REQUEST))
    })

    it('should return httpException if transaction not found', async () => {
      jest.spyOn(sut, 'remove').mockRejectedValueOnce(new HttpException('transaction not found', HttpStatus.NOT_FOUND))
      expect(sut.remove('invalid_id')).rejects.toStrictEqual(new HttpException('transaction not found', HttpStatus.NOT_FOUND))
    })
  })
})
