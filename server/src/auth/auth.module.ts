import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [GoogleStrategy, PrismaService, AuthService, UserService],
  exports: [AuthService],
  controllers: [AuthController],
})

export class AuthModule {}
