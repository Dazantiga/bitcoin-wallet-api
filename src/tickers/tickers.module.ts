import { Module } from '@nestjs/common'
import { TickersService } from './tickers.service'
import { TickersController } from './tickers.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { TickersSchema } from './schemas/tickers.schemas'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Ticker', schema: TickersSchema }])],
  controllers: [TickersController],
  providers: [TickersService]
})
export class TickersModule {}
