import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { TransactionsModule } from './transactions/transactions.module'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI_CONNECT),
    UsersModule,
    AuthModule,
    TransactionsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
