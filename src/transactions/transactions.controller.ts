import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Req, UseGuards } from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { AuthGuard } from '@nestjs/passport'

@UseGuards(AuthGuard('jwt'))
@Controller('transactions')
export class TransactionsController {
  constructor (private readonly transactionsService: TransactionsService) {}

  @Post()
  create (@Body() createTransactionDto: CreateTransactionDto, @Req() req) {
    createTransactionDto.userId = req.user.id
    return this.transactionsService.create(createTransactionDto)
  }

  @Get()
  findAll (@Req() req) {
    return this.transactionsService.findAll(req.user.id)
  }

  @Get(':id')
  findOne (@Param('id') id: string) {
    return this.transactionsService.findOne(id)
  }

  @HttpCode(204)
  @Patch(':id')
  update (@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto, @Req() req) {
    updateTransactionDto.userId = req.user.id
    return this.transactionsService.update(id, updateTransactionDto)
  }

  @HttpCode(204)
  @Delete(':id')
  remove (@Param('id') id: string) {
    return this.transactionsService.remove(id)
  }
}
