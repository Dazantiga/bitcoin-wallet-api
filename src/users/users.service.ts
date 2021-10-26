import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './entities/user.entity'
import { hashSync } from 'bcryptjs'
import { AuthService } from 'src/auth/auth.service'

@Injectable()
export class UsersService {
  constructor (
    @InjectModel('User') private readonly userRepository: Model<User>,
    @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService
  ) {}

  async create (createUserDto: CreateUserDto) {
    const userExists = await this.userRepository.findOne({ email: createUserDto.email })
    if (!userExists) {
      createUserDto.password = hashSync(createUserDto.password)
      const userSaved = await this.userRepository.create(createUserDto)
      return await this.authService.auth(userSaved)
    }
    throw new HttpException('user with email already exists', HttpStatus.BAD_REQUEST)
  }

  async findByEmail (email: string) {
    return await this.userRepository.findOne({ email }) || null
  }
}
