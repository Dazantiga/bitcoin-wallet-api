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
      console.log('OLAAAA')
      const arrDate: Array<string> = date.split('/')
      const resultBuffer = await axios(`https://www.mercadobitcoin.net/api/BTC/day-summary/${arrDate.at(2)}/${arrDate.at(1)}/${arrDate.at(0)}/`)
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
