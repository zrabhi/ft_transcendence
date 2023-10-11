import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { ConfigModule } from '@nestjs/config';
import { ChatService } from './chat.service';
@Module({
  providers: [
    ChatGateway,
    AuthService,
    PrismaService,
    UserService,
    ChatService,
  ],
  controllers: [ChatController],
  imports: [ConfigModule.forRoot()],
})
export class ChatModule {}
