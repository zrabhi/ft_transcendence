import { Controller, Module } from '@nestjs/common';
import { Invitations } from './invitation.gateway';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { ChatService } from 'src/chat/chat.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [
    Invitations,
    AuthService,
    PrismaService,
    UserService,
    ChatService,
  ],
  controllers: [],
  imports: [ConfigModule.forRoot()],
})
export class InviationModule {}
