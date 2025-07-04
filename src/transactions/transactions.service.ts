import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { InjectModel } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { Transaction } from './entities/transaction.entity'

@Injectable()
export class TransactionsService {
  constructor (@InjectModel('Transaction') private readonly transactionRepository: mongoose.Model<Transaction>) {}

  private sanitizeUpdateDto(updateTransactionDto: UpdateTransactionDto): Partial<UpdateTransactionDto> {
    const sanitizedDto: Partial<UpdateTransactionDto> = {}
    
    // Validate and sanitize userId
    if (typeof updateTransactionDto.userId === 'string' && mongoose.Types.ObjectId.isValid(updateTransactionDto.userId)) {
      sanitizedDto.userId = updateTransactionDto.userId
    } else {
      throw new HttpException('Invalid userId', HttpStatus.BAD_REQUEST)
    }
    
    // Validate and sanitize valueInvested
    if (typeof updateTransactionDto.valueInvested === 'number' && updateTransactionDto.valueInvested > 0) {
      sanitizedDto.valueInvested = updateTransactionDto.valueInvested
    } else if (updateTransactionDto.valueInvested !== undefined) {
      throw new HttpException('Invalid valueInvested', HttpStatus.BAD_REQUEST)
    }

    // Validate and sanitize btcbToBrl
    if (typeof updateTransactionDto.btcbToBrl === 'number' && updateTransactionDto.btcbToBrl > 0) {
      sanitizedDto.btcbToBrl = updateTransactionDto.btcbToBrl
    } else if (updateTransactionDto.btcbToBrl !== undefined) {
      throw new HttpException('Invalid btcbToBrl', HttpStatus.BAD_REQUEST)
    }

    // Validate and sanitize bitcoinQuantity
    if (typeof updateTransactionDto.bitcoinQuantity === 'number' && updateTransactionDto.bitcoinQuantity > 0) {
      sanitizedDto.bitcoinQuantity = updateTransactionDto.bitcoinQuantity
    } else if (updateTransactionDto.bitcoinQuantity !== undefined) {
      throw new HttpException('Invalid bitcoinQuantity', HttpStatus.BAD_REQUEST)
    }

    // Validate and sanitize date
    if (typeof updateTransactionDto.date === 'string' && updateTransactionDto.date.trim().length > 0) {
      sanitizedDto.date = updateTransactionDto.date
    } else if (updateTransactionDto.date !== undefined) {
      throw new HttpException('Invalid date', HttpStatus.BAD_REQUEST)
    }
    
    return sanitizedDto
  }

  async create (createTransactionDto: CreateTransactionDto): Promise<void> {
    const userIdValid = mongoose.Types.ObjectId.isValid(createTransactionDto.userId)
    if (userIdValid) {
      await this.transactionRepository.create(createTransactionDto)
      return
    }
    throw new HttpException('user id provided is invalid', HttpStatus.BAD_REQUEST)
  }

  findAll (userId: string) {
    const idValid = mongoose.Types.ObjectId.isValid(userId)
    if (idValid) {
      return this.transactionRepository.find({ userId }).exec()
    }
    throw new HttpException('id provided is invalid', HttpStatus.BAD_REQUEST)
  }

  async findOne (id: string) {
    const idValid = mongoose.Types.ObjectId.isValid(id)
    if (idValid) {
      const transaction = await this.transactionRepository.findById(id)
      if (transaction) {
        return transaction
      }
      throw new HttpException('transaction not found', HttpStatus.NOT_FOUND)
    }
    throw new HttpException('id provided is invalid', HttpStatus.BAD_REQUEST)
  }

  async update (id: string, updateTransactionDto: UpdateTransactionDto) {
    const idValid = mongoose.Types.ObjectId.isValid(id)
    if (idValid) {
      const transaction = await this.transactionRepository.findById(id)
      if (transaction) {
        const sanitizedUpdate = this.sanitizeUpdateDto(updateTransactionDto)
        await this.transactionRepository.findByIdAndUpdate(id, { 
          $set: { 
            userId: { $eq: sanitizedUpdate.userId },
            ...(sanitizedUpdate.valueInvested !== undefined && { valueInvested: sanitizedUpdate.valueInvested }),
            ...(sanitizedUpdate.btcbToBrl !== undefined && { btcbToBrl: sanitizedUpdate.btcbToBrl }),
            ...(sanitizedUpdate.bitcoinQuantity !== undefined && { bitcoinQuantity: sanitizedUpdate.bitcoinQuantity }),
            ...(sanitizedUpdate.date !== undefined && { date: sanitizedUpdate.date })
          } 
        })
        return
      }
      throw new HttpException('transaction not found', HttpStatus.NOT_FOUND)
    }
    throw new HttpException('id provided is invalid', HttpStatus.BAD_REQUEST)
  }

  async remove (id: string) {
    const idValid = mongoose.Types.ObjectId.isValid(id)
    if (idValid) {
      const transaction = await this.transactionRepository.findById(id)
      if (transaction) {
        await this.transactionRepository.deleteOne({ _id: id })
        return
      }
      throw new HttpException('transaction not found', HttpStatus.NOT_FOUND)
    }
    throw new HttpException('id provided is invalid', HttpStatus.BAD_REQUEST)
  }
}
