import { Test, TestingModule } from '@nestjs/testing'
import { TransactionsController } from './transactions.controller'
import { TransactionsService } from './transactions.service'

const mockTransactionservice = {
  create: jest.fn().mockResolvedValueOnce(Promise.resolve()),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn()
}

describe('TransactionsController', () => {
  let sut: TransactionsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [{
        provide: TransactionsService,
        useValue: mockTransactionservice
      }]
    }).compile()

    sut = module.get<TransactionsController>(TransactionsController)
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })
})
