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
    origin: "http://127.0.0.1:3000", // Replace with your allowed origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  app.enableCors(corsOptions);
  // app.use(passport.initialize());
  // app.use(passport.session());
  await app.listen(8080);
}

bootstrap();

