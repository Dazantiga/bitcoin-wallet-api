import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { AppService } from './app.service'
import { AuthService } from './auth/auth.service'

@Controller()
export class AppController {
  constructor (
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getHello (): string {
    return this.appService.getHello()
  }

  @UseGuards(AuthGuard('local'))
  @Post('auth')
  async auth (@Req() req: Request) {
    return this.authService.auth(req.user)
  }
}
