import { IsNumber, IsString } from 'class-validator'
export class CreateTransactionDto {
  @IsNumber()
  valueInvested: number

  @IsNumber()
  btcbToBrl: number

  @IsNumber()
  bitcoinQuantity: number

  @IsString()
  date: string

  userId: string
}
