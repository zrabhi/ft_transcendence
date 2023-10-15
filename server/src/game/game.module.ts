import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GameGateway } from './game.gateway';
@Module({
  providers: [
    AuthService,
    PrismaService,
    UserService,
    GameGateway
  ],
  imports: [ConfigModule.forRoot(), PrismaModule],
})
export class gameModule {}