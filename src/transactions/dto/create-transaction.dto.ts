import { IsNumber, IsDate, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateTransactionDto {
  @IsNumber()
  valueInvested: number

  @IsNumber()
  btcbToBrl: number

  @IsNumber()
  bitcoinQuantity: number

  @IsDate()
  @Type(() => Date)
  date: Date

  @IsString()
  userId: string
}
