/* eslint-disable dot-notation */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Ticker } from './entities/ticker.entity'
import { HttpService } from '../config/http.service'
import { ALLOWED_URLS } from '../config/allowed-urls.config'

interface MercadoBitcoinDaySummaryResponse {
  avg_price: number
}

interface MercadoBitcoinTickerResponse {
  ticker: {
    buy: string
  }
}

@Injectable()
export class TickersService {
  constructor(
    @InjectModel('Ticker') private readonly tickerRepository: Model<Ticker>,
    private readonly httpService: HttpService
  ) {}

  async getPrice(date: string, value: number) {
    const ticker = await this.tickerRepository.findOne({ date })
    if (ticker) {
      return { BTCPrice: ticker.avgPrice.toFixed(2), quantityOfBTC: (value / ticker.avgPrice).toFixed(7) }
    } else {
      const datePattern = /^\d{2}\/\d{2}\/\d{4}$/
      if (!datePattern.test(date)) {
        throw new HttpException('Formato de data inválido. Formato esperado: DD/MM/YYYY', HttpStatus.BAD_REQUEST)
      }
      const arrDate: Array<string> = date.split('/')
      const url = `${ALLOWED_URLS.MERCADO_BITCOIN.BASE_URL}${ALLOWED_URLS.MERCADO_BITCOIN.ENDPOINTS.DAY_SUMMARY}/${arrDate[2]}/${arrDate[1]}/${arrDate[0]}/`
      
      try {
        const resultBuffer = await this.httpService.get<MercadoBitcoinDaySummaryResponse>(url)
        const avgPrice = resultBuffer.avg_price
        await this.tickerRepository.create({ date, avgPrice })
        return { BTCPrice: avgPrice.toFixed(2), quantityOfBTC: (value / avgPrice).toFixed(7) }
      } catch (error) {
        if (error instanceof HttpException) {
          throw error
        }
        throw new HttpException('Erro ao obter preço do Bitcoin', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  async getCurrentPrice(value: number) {
    try {
      const url = `${ALLOWED_URLS.MERCADO_BITCOIN.BASE_URL}${ALLOWED_URLS.MERCADO_BITCOIN.ENDPOINTS.TICKER}`
      const resultBuffer = await this.httpService.get<MercadoBitcoinTickerResponse>(url)
      const currentPrice = Number(resultBuffer.ticker.buy)
      return { BTCPrice: currentPrice.toFixed(2), quantityOfBTC: (value / currentPrice).toFixed(7) }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException('Erro ao obter preço atual do Bitcoin', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
