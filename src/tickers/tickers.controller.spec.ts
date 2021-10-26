import { Test, TestingModule } from '@nestjs/testing';
import { TickersController } from './tickers.controller';
import { TickersService } from './tickers.service';

describe('TickersController', () => {
  let controller: TickersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TickersController],
      providers: [TickersService],
    }).compile();

    controller = module.get<TickersController>(TickersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
