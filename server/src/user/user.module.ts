import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports:[ConfigModule.forRoot()],
  providers: [UserService,  PrismaService ],
  controllers: [UserController]
})

export class UserModule {}
