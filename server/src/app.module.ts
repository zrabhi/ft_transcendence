import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [UserModule, PrismaModule, AppModule, AuthModule,ChatModule],
  controllers: [],
})

export class AppModule
{}
