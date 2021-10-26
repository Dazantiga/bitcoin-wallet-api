import { Document } from 'mongoose'

export interface Ticker extends Document {
  readonly avgPrice: number
  readonly date: string
}
