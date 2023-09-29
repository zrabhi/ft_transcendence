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
import { Jwt2faStrategy } from './Jwt2faAuth';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION,
      },
    }),
  ],
  providers: [
    GoogleStrategy,
    FtStrategy,
    Jwt2faStrategy,
    JwtStrategy,
    PrismaService,
    AuthService,
    UserService,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
