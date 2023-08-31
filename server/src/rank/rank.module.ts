import { Module } from '@nestjs/common';
import { RankService } from './rank.service';
import { RankController } from './rank.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [RankService, PrismaService],
  controllers: [RankController],
  imports: [PrismaModule, ConfigModule.forRoot()]
})
export class RankModule {}
