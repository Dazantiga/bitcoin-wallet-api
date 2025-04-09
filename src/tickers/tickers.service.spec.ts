import { Test, TestingModule } from '@nestjs/testing';
import { TickersService } from './tickers.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticker } from './entities/ticker.entity';
import { HttpService } from '../config/http.service';

// Mock do modelo Ticker
const mockTickerModel = {
  findOne: jest.fn(),
  create: jest.fn()
};

// Mock do HttpService
const mockHttpService = {
  get: jest.fn()
};

describe('TickersService', () => {
  let service: TickersService;
  let model: Model<Ticker>;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TickersService,
        {
          provide: getModelToken('Ticker'),
          useValue: mockTickerModel
        },
        {
          provide: HttpService,
          useValue: mockHttpService
        }
      ],
    }).compile();

    service = module.get<TickersService>(TickersService);
    model = module.get<Model<Ticker>>(getModelToken('Ticker'));
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
