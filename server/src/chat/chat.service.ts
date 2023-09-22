//TODO: CREATE ALL CHAT SERVICE HERE

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { createChannelDto, createDmDto, createRoomDto } from './dto/chat.dto';
import { User } from 'src/auth/decorator/user-decorator';
import { Channel } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class ChatService {
  constructor(
    private _prisma: PrismaService,
    private readonly _user: UserService,
    private readonly jwtService: JwtService,
  ) {}


  async getCHannelRoom(channelName: string)
  {
    return this._prisma.channel.findMany({
      where:{
      OR: [{name: channelName}],
      }
    })
  }
  async getChannelById(channelId: string)
  {
    return await this._prisma.channel.findUnique({
      where:
      {
        id: channelId
      }
    })
  }
  async checkChannelDmExistence(
    user: string,
    otherUser: string,
  ): Promise<Channel | any> {
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
    });
    return search;
  }

  async checkChannelRoomExistence(name: string): Promise<Channel | any> {
    const search = await this._prisma.channel.findUnique({
      where: {
        name: name,
      },
    });
    console.log(search);

    return search;
  }
  async handleCreateRoomChannel(
    user_id: string,
    createRoom: createRoomDto,
  ): Promise<Channel | any> {
    const { name, password, type, memberLimit } = createRoom;
    const user = await this._user.findUserById(user_id);

    const result = await this.checkChannelRoomExistence(name);
    if (result) return { error: 'Channel already exists', channel: undefined };
    let channel: any;
    if (type === 'PUBLIC') {
      channel = await this._prisma.channel.create({
        data: {
          name: name,
          owner: user.username,
          type: 'PUBLIC',
          member_limit: memberLimit,
        },
      });
    }
    if (type === 'PROTECTED') {
      if (!password)
        return {
          error: 'Password must be set with PROTECTED channels',
          channel: undefined,
        };
      const channelPassword = await bcrypt.hash(password, 10);
      channel = await this._prisma.channel.create({
        data: {
          name: name,
          owner: user.username,
          type: 'PROTECTED',
          member_limit: memberLimit,
          password: channelPassword,
        },
      });
      // Todo: create Protected channel
    }
    await this._prisma.channelMembers.create({
      data: {
        userId: user.id,
        channelId: channel.id,
        role: 'OWNER',
      },
    });
    return { error: undefined, channel: channel };
  }

  async getChannelDmMessages(channel_id: string, user: any) {
    const messages = await this._prisma.channelMessage.findMany({
      where: { channel_id: channel_id },
    });
    const allMessage = [];
    for (const message of messages) {
      if (message.user_id === user.id)
        allMessage.push({
          reciever: user.username,
          avatar: user.avatar,
          content: message.content,
        });
      else {
        const otherUser = await this._user.findUserById(message.user_id);
        allMessage.push({
          sender: otherUser.username,
          avatar: otherUser.avatar,
          content: message.content,
        });
      }
    }
    return allMessage;
  }

  async handleGetRoomMessages(channel_id: string, user_id: string)
  {
    const user = await this._user.findUserById(user_id);
    const messages = await this._prisma.channelMessage.findMany({
      where:{
        channel_id: channel_id,
      }
    })
    const allMessages = []
    for (const message of messages)
    {
      if (message.user_id === user_id)
      allMessages.push({
        reciever: user.username,
        avatar: user.avatar,
        content: message.content,
      });
      else
      {
        const otherUser = await this._user.findUserById(message.user_id);
        allMessages.push({
          sender: otherUser.username,
          avatar: otherUser.avatar,
          content: message.content,
        });
      }
    }
    return allMessages;
  }
  //TODO: check if the user is blocked from the channel
  async handleJoinChannelRoom(name: string, user: any, password: string) {
    console.log(user.username, user.id);
    const channel = await this._prisma.channel.findUnique({
      where: {
        name: name,
      },
      include: {
        members: true,
      },
    });
    if (!channel) return { error: 'Channel not found', channel: undefined };
    let isInChnnael = channel.members.filter((member) => {
      if (member.userId === user.id) return true;
    });
    if (isInChnnael.length > 0)
      return {
        error: `${user.username} your already in channel`,
        channel: undefined,
      };
    if (channel.type === 'PROTECTED') {
      if (!password)
        return {
          error: 'you must provide channel password to join a PROTECTED channel',
          channel: undefined,
        };
      const match = await bcrypt.compare(password, channel.password);
      if (!match)
        return { error: 'Channel password is not valid', channel: undefined };
    }
    await this._prisma.channelMembers.create({
      data: {
        userId: user.id,
        channelId: channel.id,
        role: 'MEMBER',
      },
    });
    return { error: undefined, channel: channel };
  }

  async handleCreateDmChannel(user_id: string, createDm: createDmDto) {
    const { username, memberLimit } = createDm;
    const user = await this._user.findUserById(user_id);
    const otherUser = await this._user.findUserName(username);

    const result = await this.checkChannelDmExistence(user.username, username);
    if (result.length > 0) return result[0];
    const channel = await this._prisma.channel.create({
      data: {
        name:  uuidv4(),
        member_limit: memberLimit,
        type: 'DM',
        users: [username, user.username],
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
  //Todo: saveMessageToChannel:

  async saveMessageToChannel(user: any, messageInfo: any) {
    await this._prisma.channelMessage.create({
      data: {
        channel_id: messageInfo.channelId,
        user_id: user.id,
        content: messageInfo.message,
      },
    });
  }

  async getAllUserChannelsDm(username: string): Promise<Channel[]> {
    const channelsDm = await this._prisma.channel.findMany({
      where: {
        AND: [{ users: { has: username } }],
      },
      include: {
        messages: true,
      },
    });
    return channelsDm;
  }

  async getAllChannelsRooms(user: any) {

    const Allchannels = await this._prisma.channel.findMany({
      include:{
        members: true,
        messages:true
      }
    })
    const Rooms = [];
    for (const channel of Allchannels) {
        let isInRoom  = [];
        if (channel.users.length === 0)
        {
          isInRoom = channel.members.filter(member => {
          if (member.userId === user.id) {
              return true
          }})
        }
        if (isInRoom.length > 0)
            Rooms.push(channel)
    }
    console.log("Rooms", Rooms);
    return Rooms
  }
}
