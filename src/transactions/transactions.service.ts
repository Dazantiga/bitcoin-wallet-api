import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { InjectModel } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { Transaction } from './entities/transaction.entity'

@Injectable()
export class TransactionsService {
  constructor (@InjectModel('Transaction') private readonly transactionRepository: mongoose.Model<Transaction>) {}

  private sanitizeUpdateDto(updateTransactionDto: UpdateTransactionDto): UpdateTransactionDto {
    const sanitizedDto: UpdateTransactionDto = {}
    
    // Validate and sanitize userId
    if (typeof updateTransactionDto.userId === 'string' && mongoose.Types.ObjectId.isValid(updateTransactionDto.userId)) {
      sanitizedDto.userId = updateTransactionDto.userId
    } else {
      throw new HttpException('Invalid userId', HttpStatus.BAD_REQUEST)
    }
    
    // Validate and sanitize other fields (example: amount)
    if (typeof updateTransactionDto.amount === 'number' && updateTransactionDto.amount > 0) {
      sanitizedDto.amount = updateTransactionDto.amount
    } else if (updateTransactionDto.amount !== undefined) {
      throw new HttpException('Invalid amount', HttpStatus.BAD_REQUEST)
    }
    
    // Add more validation and sanitization as needed for other fields
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
            ...(sanitizedUpdate.amount !== undefined && { amount: sanitizedUpdate.amount })
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
