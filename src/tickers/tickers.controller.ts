import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { TickersService } from './tickers.service'

@UseGuards(AuthGuard('jwt'))
@Controller('tickers')
export class TickersController {
  constructor (private readonly tickersService: TickersService) {}

  @Get()
  findPrice (@Query('date') date: string, @Query('value') value: string) {
    if (date === new Date().toLocaleDateString()) {
      return this.tickersService.getCurrentPrice(Number(value))
    } else {
      return this.tickersService.getPrice(date, Number(value))
    }
  }
}
