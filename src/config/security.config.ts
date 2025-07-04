import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import * as hpp from 'hpp';

export function configureSecurityMiddleware(app: INestApplication) {
  // Proteção contra ataques comuns
  app.use(helmet());
  
  // Proteção contra HTTP Parameter Pollution
  app.use(hpp());
  
  // Rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // limite de 100 requisições por windowMs
      message: 'Too many requests from this IP, please try again later.'
    })
  );

  // Configuração de CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Total-Count'],
    credentials: true,
    maxAge: 3600,
  });

  // Headers de segurança adicionais
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  }));

  app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
} 