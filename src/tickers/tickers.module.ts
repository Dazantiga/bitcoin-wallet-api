import { Module } from '@nestjs/common'
import { TickersService } from './tickers.service'
import { TickersController } from './tickers.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { TickersSchema } from './schemas/tickers.schemas'
import { HttpService } from '../config/http.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Ticker', schema: TickersSchema }])],
  controllers: [TickersController],
  providers: [TickersService, HttpService]
})
export class TickersModule {}
