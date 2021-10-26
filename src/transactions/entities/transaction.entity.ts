import { Document } from 'mongoose'

export interface Transaction extends Document{
  readonly valueInvested: number
  readonly btcbToBrl: number
  readonly bitcoinQuantity: number
  readonly date: string
  readonly userId: string
}
