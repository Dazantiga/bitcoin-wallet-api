import { MongooseModuleOptions } from '@nestjs/mongoose'

export const mongooseConfig: MongooseModuleOptions = {
  autoIndex: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 10000
}