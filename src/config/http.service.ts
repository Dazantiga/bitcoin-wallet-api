import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { isAllowedUrl } from './allowed-urls.config'

@Injectable()
export class HttpService {
  private readonly axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      timeout: 5000,
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 300
    })

    // Interceptor para validar URLs
    this.axiosInstance.interceptors.request.use((config) => {
      if (!config.url || !isAllowedUrl(config.url)) {
        throw new HttpException('URL não permitida', HttpStatus.FORBIDDEN)
      }
      return config
    })
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(url, config)
      return response.data
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(
        'Erro ao realizar requisição externa',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
} 