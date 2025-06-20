import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/all-exceptions';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  console.log(process.env.FE_ORIGIN, '-----------');
  console.log(process.env.COOKIE_DOMAIN, '-----------');
  console.log(process.env.NODE_ENV, '-----------');
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: process.env?.FE_ORIGIN?.split(','),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'Referer',
      'sec-ch-ua',
      'sec-ch-ua-platform',
      'sec-ch-ua-mobile',
    ],
    credentials: true,
  });

  app.use(cookieParser());

  app.useLogger(new Logger());
  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
