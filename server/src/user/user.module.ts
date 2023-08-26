import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  providers: [UserService,  PrismaService],
  controllers: [UserController]
})

export class UserModule {}
