import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { configureSecurityMiddleware } from './config/security.config'

async function bootstrap () {
  const app = await NestFactory.create(AppModule)
  
  // Configuração de segurança
  configureSecurityMiddleware(app)
  
  // Validação global de entrada
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove propriedades não decoradas
    forbidNonWhitelisted: true, // Rejeita propriedades não decoradas
    transform: true, // Transforma automaticamente os tipos
    transformOptions: {
      enableImplicitConversion: true,
    },
  }))

  await app.listen(process.env.PORT || 3000)
}
bootstrap()
