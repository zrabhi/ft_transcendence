import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { GoogleStrategy } from './auth/Strategys/GoogleStrategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { RankModule } from './rank/rank.module';

@Module({

  imports: [UserModule, PrismaModule, AppModule, AuthModule, RankModule],
  controllers: [],
})

export class AppModule {}
