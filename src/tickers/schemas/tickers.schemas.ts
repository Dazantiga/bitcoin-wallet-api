import { Schema } from 'mongoose'

export const TickersSchema = new Schema({
  avgPrice: { type: Number, required: true },
  date: { type: String, required: true }
})
