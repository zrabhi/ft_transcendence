import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './Strategys/GoogleStrategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { FtStrategy } from './Strategys/42Strategy';
import { JwtStrategy } from './Strategys/JwtStrategy';
import { GithubStrategy } from './Strategys/GithubStrategy';

@Module({
  imports: [ConfigModule.forRoot(), PassportModule, JwtModule.register({
    global: true,
    secret: 'SECRET_KEY',
    signOptions: {
      expiresIn:'1h'
    }
  })],
  providers: [GoogleStrategy, FtStrategy,GithubStrategy, JwtStrategy, PrismaService, AuthService, UserService],
  exports: [AuthService],
  controllers: [AuthController],
})

export class AuthModule {}
