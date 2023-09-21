import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import passport from 'passport';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));
  const corsOptions = {
    origin: process.env.HOSTNAME, // Replace with your allowed origin
    methods: process.env.METHODS,
    credentials: true,
  };

  app.enableCors(corsOptions);
  await app.listen(8080);
}

bootstrap();

