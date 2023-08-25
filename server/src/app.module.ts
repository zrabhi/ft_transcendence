import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ChannelModule } from './channel/channel.module';
import { MessageModule } from './message/message.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { GoogleStrategy } from './auth/Strategys/GoogleStrategy';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({

  imports: [UserModule, PrismaModule, ChannelModule, MessageModule, AppModule, AuthModule],
  controllers: [],
})

export class AppModule {}
