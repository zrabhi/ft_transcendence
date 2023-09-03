import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { userRepository } from './user.repository';

@Module({
  imports:[ConfigModule.forRoot()],
  providers: [UserService,  PrismaService, userRepository],
  controllers: [UserController]
})

export class UserModule {}
