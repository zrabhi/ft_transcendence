//TODO: CREATE ALL CHAT SERVICE HERE

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { createChannelDto, createDmDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    private _prisma: PrismaService,
    private readonly _user: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async checkChannelDmExistence(user: string, otherUser: string) {
    return await this._prisma.channel.findFirst({
      where: {
        OR: [{ name: user }, { name: otherUser }],
      },
    });
  }

 async handleCreateDmChannel(user_id: string, createDm: createDmDto) {
    const { username, memberLimit } = createDm;
    const user = await this._user.findUserById(user_id);
    const otherUser = await this._user.findUserName(username);

    const result = await this.checkChannelDmExistence(
      user.username,
      username,
    );
    console.log(result);
    if (result) return false;
    const channel = await this._prisma.channel.create({
      data: {
        name: user.username,
        member_limit: memberLimit,
        type: 'DM',
      },
    });
    await this._prisma.channelMembers.create({
      data: {
        userId: user.id,
        channelId: channel.id,
        role: 'MEMBER',
      },
    });

    await this._prisma.channelMembers.create({
      data: {
        userId: otherUser.id,
        channelId: channel.id,
        role: 'MEMBER',
      },
    });
    return channel;
  }
  //Todo: saveMessageToChannel

  async saveMessageToChannel()
  {

  }

}

