/* eslint-disable dot-notation */
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Ticker } from './entities/ticker.entity'
import axios from 'axios'

@Injectable()
export class TickersService {
  constructor (@InjectModel('Ticker') private readonly tickerRepository: Model<Ticker>) {}

  async getPrice (date: string, value: number) {
    const ticker = await this.tickerRepository.findOne({ date })
    if (ticker) {
      return { BTCPrice: ticker.avgPrice.toFixed(2), quantityOfBTC: (value / ticker.avgPrice).toFixed(7) }
    } else {
      const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!datePattern.test(date)) {
        throw new Error('Invalid date format. Expected format: DD/MM/YYYY');
      }
      const arrDate: Array<string> = date.split('/')
      const resultBuffer = await axios(`https://www.mercadobitcoin.net/api/BTC/day-summary/${arrDate[2]}/${arrDate[1]}/${arrDate[0]}/`)
      const avgPrice = resultBuffer['data']['avg_price']
      await this.tickerRepository.create({ date, avgPrice })
      return { BTCPrice: avgPrice.toFixed(2), quantityOfBTC: (value / avgPrice).toFixed(7) }
    }
  }

  async getCurrentPrice (value: number) {
    const resultBuffer = await axios('https://www.mercadobitcoin.net/api/BTC/ticker/')
    const currentPrice = Number(resultBuffer['data']['ticker']['buy'])
    return { BTCPrice: currentPrice.toFixed(2), quantityOfBTC: (value / currentPrice).toFixed(7) }
  }
}
