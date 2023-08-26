import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChannelController } from './channel.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [ChannelService, PrismaService],
  controllers: [ChannelController],
})
export class ChannelModule {}
