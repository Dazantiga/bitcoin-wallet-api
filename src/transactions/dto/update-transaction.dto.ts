import { IsNumber, IsString, IsOptional } from 'class-validator'

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
  @IsString()
  date: string

  @IsOptional()
  @IsString()
  userId: string
}
