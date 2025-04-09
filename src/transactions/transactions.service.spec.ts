import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from './entities/transaction.entity';

// Mock do modelo Transaction
const mockTransactionModel = {
  create: jest.fn(),
  find: jest.fn().mockReturnThis(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
  exec: jest.fn()
};

describe('TransactionsService', () => {
  let service: TransactionsService;
  let model: Model<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getModelToken('Transaction'),
          useValue: mockTransactionModel
        }
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    model = module.get<Model<Transaction>>(getModelToken('Transaction'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
