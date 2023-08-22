import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChannelController } from './channel.controller';

@Module({
  providers: [ChannelService, PrismaService],
  controllers: [ChannelController]
})
export class ChannelModule {}
