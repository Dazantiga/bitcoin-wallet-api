import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { InjectModel } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { Transaction } from './entities/transaction.entity'

@Injectable()
export class TransactionsService {
  constructor (@InjectModel('Transaction') private readonly transactionRepository: mongoose.Model<Transaction>) {}

  async create (createTransactionDto: CreateTransactionDto): Promise<void> {
    const userIdValid = mongoose.Types.ObjectId.isValid(createTransactionDto.userId)
    if (userIdValid) {
      await this.transactionRepository.create(createTransactionDto)
      return
    }
    throw new HttpException('user id provided is invalid', HttpStatus.BAD_REQUEST)
  }

  findAll () {
    return this.transactionRepository.find().exec()
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
        await this.transactionRepository.findByIdAndUpdate(id, { $set: updateTransactionDto })
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
