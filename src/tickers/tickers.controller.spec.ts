import { Test, TestingModule } from '@nestjs/testing'
import { TickersController } from './tickers.controller'
import { TickersService } from './tickers.service'

const mockTickersService = {
  getCurrentPrice: jest.fn(value => Promise.resolve({ BTCPrice: '345000.00', quantityOfBTC: '0.0000178' })),
  getPrice: jest.fn((date, value) => Promise.resolve({ BTCPrice: '340000.00', quantityOfBTC: '0.0000260' }))
}

describe('TickersController', () => {
  let sut: TickersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TickersController],
      providers: [TickersService]
    })
    .overrideProvider(TickersService)
    .useValue(mockTickersService)
    .compile()

    sut = module.get<TickersController>(TickersController)
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  describe('findPrice', () => {
    it('should returns BTCPrice and quantityOfBTC on sucess if Date === Date.now()', async () => {
      expect(sut.findPrice('26/10/2021', '500')).toStrictEqual(Promise.resolve({ BTCPrice: '345000.00', quantityOfBTC: '0.0000178' }))
    })

    it('should returns BTCPrice and quantityOfBTC on sucess if Date !== Date.now()', async () => {
      expect(sut.findPrice('25/10/2021', '500')).toStrictEqual(Promise.resolve({ BTCPrice: '340000.00', quantityOfBTC: '0.0000260' }))
    })
  })
})
