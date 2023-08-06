import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  imports: [PrismaModule]
})
export class PrismaModule {}
