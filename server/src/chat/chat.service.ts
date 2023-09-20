//TODO: CREATE ALL CHAT SERVICE HERE

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { createChannelDto, createDmDto } from './dto/chat.dto';
import { User } from 'src/auth/decorator/user-decorator';
import { Channel } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(
    private _prisma: PrismaService,
    private readonly _user: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async checkChannelDmExistence(user: string, otherUser: string): Promise<Channel | any > {
    const search = await this._prisma.channel.findMany({
      where: {
        AND: [
          { users: { has: user } }, // Check if userId1 is in the 'users' array
          { users: { has: otherUser } }, // Check if userId2 is in the 'users' array
        ],
      },
      select: {
        id: true,
        name: true, // You can select other fields you need from the channel
        users: true,
      },
    })
    return search
  }
  async getChannelMessages(channel_id: string, username: string ) {

    const user = await this._user.findUserName(username);
    const messages = await this._prisma.channelMessage.findMany({
      where: { channel_id: channel_id },
    });
    const allMessage = [];
    for (const message of messages) {
      if (message.user_id === user.id)
      allMessage.push({sender:user.username, avatar: user.avatar, content: message.content})
      else
      {
        const otherUser =await this._user.findUserById(message.user_id);
        allMessage.push({reciever:otherUser.username, avatar:otherUser.avatar, content: message.content});
      }
    }
    return allMessage;
  }

  async handleCreateDmChannel(user_id: string, createDm: createDmDto)  {
    const { username, memberLimit } = createDm;
    const user = await this._user.findUserById(user_id);
    const otherUser = await this._user.findUserName(username);

    const result = await this.checkChannelDmExistence(user.username, username);
    if (result.length > 0)
          return result[0];
    const channel = await this._prisma.channel.create({
      data: {
        name: user.username,
        member_limit: memberLimit,
        type: 'DM',
        users: [username, user.username]
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

  async saveMessageToChannel(user, messageInfo) {

    const message = await this._prisma.channelMessage.create({
      data: {
        channel_id: messageInfo.channelId,
        user_id: user.id,
        content: messageInfo.message
      }
    })

  }

  async getAllUserChannels(username: string) : Promise<Channel[]>
  {
        return await this._prisma.channel.findMany({
          where:{
            AND: [{ users: { has: username } }]
          },
          include: {
            messages: true,
          }
        })
  }
}
