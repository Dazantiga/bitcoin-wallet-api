import { Schema } from 'mongoose'

export const TransactionSchema = new Schema({
  valueInvested: { type: Number, required: true },
  btcbToBrl: { type: Number, required: true },
  bitcoinQuantity: { type: Number, required: true },
  date: { type: Date, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }
})
