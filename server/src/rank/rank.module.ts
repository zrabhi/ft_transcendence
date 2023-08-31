import { Module } from '@nestjs/common';
import { RankService } from './rank.service';
import { RankController } from './rank.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [RankService, PrismaService],
  controllers: [RankController],
  imports:[PrismaModule]
})
export class RankModule {}
