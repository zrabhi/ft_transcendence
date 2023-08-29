import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [MessageController],
  imports:[ConfigModule.forRoot()],
  providers: [MessageService, PrismaService]
})
export class MessageModule {}
