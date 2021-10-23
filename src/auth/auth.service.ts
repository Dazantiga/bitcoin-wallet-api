import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compareSync } from 'bcryptjs'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class AuthService {
  constructor (
    private readonly userService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validatePassword (password: string, hashedPassword: string): Promise<boolean> {
    return compareSync(password, hashedPassword)
  }

  async validateUser (email: string, password: string) {
    const user = await this.userService.findByEmail(email)
    if (user) {
      const passwordIsValid = await this.validatePassword(user.password, password)
      if (passwordIsValid) {
        return user
      }
    }
    return null
  }

  async auth (user: any) {
    const payload = { id: user.id }
    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}
