import { IsNumber, IsDate, IsString, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateTransactionDto {
  @IsOptional()
  @IsNumber()
  valueInvested: number

  @IsOptional()
  @IsNumber()
  btcbToBrl: number

  @IsOptional()
  @IsNumber()
  bitcoinQuantity: number

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date

  @IsOptional()
  @IsString()
  userId: string
}
