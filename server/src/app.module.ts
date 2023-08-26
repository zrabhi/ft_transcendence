import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ChannelModule } from './channel/channel.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [UserModule, PrismaModule, ChannelModule, MessageModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
