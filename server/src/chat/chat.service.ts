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

  async getAllChannels(user: any) {
    const currUser = await this._user.findUserById(user.id);
    const channels = await this._prisma.channel.findMany({
      include: {
        members: true,
      },
    });
    const rooms = [];
    for (const channel of channels) {
      const members = [];
      if (channel.type === 'DM' || channel.type === 'PRIVATE') continue;
      const searchedUser = channel.members.filter((member: any) => {
        return member.userId === currUser.id;
      });
      if (searchedUser[0] || searchedUser[0].isBanned) continue;
      else {
        let Key = 0;
        for (const member of channel.members) {
          const user = await this._user.findUserById(member.userId);
          let checker = 'Member';
          if (member.role === 'ADMIN') checker = 'Admin';
          if (member.role === 'OWNER') checker = 'Owner';
          members.push({
            id: Key++,
            name: user.username,
            avatar: user.avatar,
            status: user.status,
            role: checker,
          });
        }
        rooms.push({
          channel: channel,
          members: members,
        });
    }
  }
    console.log('channels listed are ', rooms);
    return rooms;
}
  async getCHannelRoom(channelName: string) {
    return this._prisma.channel.findMany({
      where: {
        OR: [{ name: channelName }],
      },
    });
  }
  async getChannelById(channelId: string) {
    const channel = await this._prisma.channel.findUnique({
      where: {
        id: channelId,
      },
      include: {
        members: true,
      },
    });
    return channel;
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
        type: true,
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
    return search;
  }
  async handleCreateRoomChannel(
    user_id: string,
    createRoom: createRoomDto,
  ): Promise<Channel | any> {
    const { name, password, type, memberLimit } = createRoom;
    const user = await this._user.findUserById(user_id);

    const result = await this.checkChannelRoomExistence(name);
    if (result) return { error: 'Room already exists', channel: undefined };
    let channel: any;
    console.log('type', type);

    if (type === 'PUBLIC') {
      channel = await this._prisma.channel.create({
        data: {
          name: name,
          owner: user.username,
          type: 'PUBLIC',
          member_limit: memberLimit,
        },
      });
      console.log(channel);
    }
    if (type === 'PROTECTED') {
      if (!password)
        return {
          error: 'Password must be set with PROTECTED Rooms',
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
      // Todo: create PRIVATE channel
    }
    if (type === 'PRIVATE') {
      channel = await this._prisma.channel.create({
        data: {
          name: name,
          owner: user.username,
          type: 'PRIVATE',
          member_limit: memberLimit,
        },
      });
      console.log(channel);
    }
    await this._prisma.channelMembers.create({
      data: {
        userId: user.id,
        channelId: channel.id,
        role: 'OWNER',
      },
    });
    return { error: undefined, channel: channel, user: user };
  }

  async getChannelDmMessages(channel_id: string, user_id: string) {
    const channel = await this._prisma.channel.findUnique({
      where: { id: channel_id },
      include: {
        messages: true,
        members: true,
      },
    });
    const user = await this._user.findUserById(user_id);
    const allMessages = [];
    console.log('channel', channel_id);

    if (channel.messages.length > 0) {
      for (const message of channel.messages) {
        if (message.user_id === user.id)
          allMessages.push({
            reciever: user.username,
            avatar: user.avatar,
            time: message.time,
            content: message.content,
          });
        else {
          const otherUser = await this._user.findUserById(message.user_id);
          allMessages.push({
            sender: otherUser.username,
            avatar: otherUser.avatar,
            time: message.time,
            content: message.content,
          });
        }
      }
    }
    const users = [];
    for (const member of channel.members) {
      const searchedUser = await this._user.findUserById(member.userId);
      let checker = 'Member';
      if (member.role === 'ADMIN') checker = 'Admin';
      if (channel.owner === searchedUser.username) checker = 'Owner';
      users.push({
        username: searchedUser.username,
        avatar: searchedUser.avatar,
        status: searchedUser.status,
        owner: checker,
      });
    }
    return { allMessages, users }; // returning all messages and users in channel
  }

  async handleGetRoomMessages(channel_id: string, user_id: string) {
    const user = await this._user.findUserById(user_id);
    const messages = await this._prisma.channelMessage.findMany({
      where: {
        channel_id: channel_id,
      },
    });
    const allMessages = [];
    for (const message of messages) {
      if (message.user_id === user_id)
        allMessages.push({
          reciever: user.username,
          avatar: user.avatar,
          time: message.time,
          content: message.content,
        });
      else {
        const otherUser = await this._user.findUserById(message.user_id);
        allMessages.push({
          sender: otherUser.username,
          avatar: otherUser.avatar,
          time: message.time,
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
          error:
            'you must provide channel password to join a PROTECTED channel',
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
    if (result.length > 0) {
      const data = {
        channel: result[0],
        user: user,
      };
      return data;
    }
    const channel = await this._prisma.channel.create({
      data: {
        name: uuidv4(),
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
    return { channel: channel, user: otherUser };
  }
  //Todo: saveMessageToChannel:

  async saveMessageToChannel(user: any, messageInfo: any) {
    await this._prisma.channelMessage.create({
      data: {
        channel_id: messageInfo.channelId,
        user_id: user.id,
        content: messageInfo.message,
        time: messageInfo.time,
      },
    });
  }

  async getAllUserChannelsDm(currUser: any): Promise<Channel[]> {
    const channelsDm = await this._prisma.channel.findMany({
      where: {
        AND: [{ users: { has: currUser.username } }],
      },
      include: {
        messages: true,
      },
    });
    return channelsDm;
  }

  async getAllChannelsRooms(user: any) {
    const Allchannels = await this._prisma.channel.findMany({
      include: {
        members: true,
        messages: true,
      },
    });
    const Rooms = [];
    for (const channel of Allchannels) {
      let isInRoom = [];
      if (channel.users.length === 0) {
        isInRoom = channel.members.filter((member) => {
          if (member.userId === user.id) {
            return true;
          }
        });
      }
      if (isInRoom.length > 0) Rooms.push(channel);
    }
    return Rooms;
  }
  async handleDeleteRoom(channel_id: string, user: any) {
    try {
      const channel = await this._prisma.channel.findUnique({
        where: {
          id: channel_id,
        },
      });
      if (channel.owner != user.username)
        return {
          success: false,
          error: 'Your not the channel owner to do this action',
        };
      await this._prisma.channel.delete({
        where: {
          id: channel_id,
        },
        include: {
          members: true,
          messages: true,
        },
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Channel not foudn or already deleted!' };
    }
  }
  async handleLeaveChannel(currUser: any, channel_id: string) {
    const channel = await this._prisma.channel.findUnique({
      where: {
        id: channel_id,
      },
      include: {
        members: true,
      },
    });
    if (channel.owner === currUser.username)
      return {
        success: false,
        error: `${currUser.username} your the channel owner (you can delete channel from existence)!`,
      };
    const searchedUser = channel.members.filter((member: any) => {
      return currUser.id === member.userId;
    });
    if (!searchedUser[0])
      return {
        success: false,
        message: `${currUser.username} Your no longer channel member`,
      };
    for (const member of channel.members) {
      if (member.id === searchedUser[0].id) {
        await this._prisma.channelMembers.delete({
          where: {
            id: searchedUser[0].id,
          },
        });
        return {
          success: true,
          message: `${currUser.username} You left the channel!`,
        };
      }
    }
  }
  async handleAddMember(user: any, channelId: string, username: string) {
    const currUser = await this._user.findUserById(user.id);
    const addedUser = await this._user.findUserName(username);
    const channel = await this._prisma.channel.findUnique({
      where: {
        id: channelId,
      },
      include: {
        members: true,
        messages: true,
      },
    });
    let lastConvo = [];
    if (!channel || !addedUser)
      return {
        success: false,
        error: 'No channel found or the user to be added',
      };
    if (channel.owner != currUser.username)
      return { success: false, error: 'you are not allowed to do this action' };
    for (const member of channel.members) {
      if (member.userId === addedUser.id)
        return { success: false, error: 'member already exists' };
    }
    try {
      await this._prisma.channelMembers.create({
        data: {
          channelId: channel.id,
          userId: addedUser.id,
          role: 'MEMBER',
        },
      });
      const lastMessage = channel.messages[channel.messages.length - 1];
      if (!lastMessage)
        return {
          success: true,
          error: 'member added successfully',
          channel: channel,
        };
      const lastConvo = {
        type: 'room',
        channel: {
          id: channel.id,
          name: channel.name, /// it ay be deleteedd
          avatar: channel.avatar,
          message: lastMessage.content,
          time: lastMessage.created_at,
          status: '',
        },
      };
      return {
        success: true,
        error: 'member added successfully',
        channel: channel,
        lastMessage: lastConvo,
      };
    } catch (err) {
      return { success: false, error: 'error occured' };
    }
  }
  //////////////////// Ban method && Mute Method && Set As Admin /////////////////////////////////////
  async handleSetAsAdmin(user: any, channel_id: string, userToBeSet: string) : Promise<any> {
    const currUser = await this._user.findUserById(user.id);
    const newAdmin = await this._user.findUserName(userToBeSet);
    const channel = await this._prisma.channel.findUnique({
      where: {
        id: channel_id,
      },
      include: {
        members: true,
      },
    });
    if (newAdmin.username === channel.owner)
      return {
        success: false,
        error: `${newAdmin.username} The User is The channel owner ()`,
      };
    if (currUser.username != channel.owner)
      return {
        success: false,
        error: `${currUser.username} Only the Owner can set New admins`,
      };
    const searchedUser = channel.members.filter((member: any) => {
      return newAdmin.id === member.userId;
    });
    console.log('user is found ', searchedUser);
    for (const member of channel.members) {
      if (searchedUser[0].id === member.id) continue;
      if (member.userId === currUser.id) {
        if (searchedUser[0].role === 'ADMIN')
          return {
            success: false,
            error: `${newAdmin.username} is already an admin`,
          };
        else {
          await this._prisma.channelMembers.update({
            where: {
              id: searchedUser[0].id,
            },
            data: {
              role: 'ADMIN',
            },
          });
          return {
            success: true,
            message: 'the user  now setted as an admin of the channel',
          };
        }
      }
    }
    return searchedUser[0];
  }

  async handleUserMute(user: any, channel_id: string, userToBeMuted: string) {
    const currUser = await this._user.findUserById(user.id);
    const mutedUser = await this._user.findUserName(userToBeMuted);
    const channel = await this._prisma.channel.findUnique({
      where: {
        id: channel_id,
      },
      include: {
        admins: true,
        members: true,
      },
    });
    if (mutedUser.username === channel.owner)
      return {
        error: `channel owner ${mutedUser.username} cant be muted by the  Members or Admins`,
        success: false,
      };
    let searchedUser: any = channel.members.filter((member) => {
      return member.userId === mutedUser.id;
    });
    console.log(searchedUser);

    for (const member of channel.members) {
      if (searchedUser[0].id === member.id) continue;
      console.log('searched user ', member.userId);
      // if (member.userId === mutedUser.id && member.role === 'ADMIN')
      if (
        member.userId === currUser.id &&
        (member.role === 'ADMIN' || member.role === 'OWNER')
      ) {
        if (searchedUser.role === 'ADMIN' && member.role === 'ADMIN')
          return {
            error: 'channels admins Cant ban each other',
            success: false,
          };
        else {
          await this._prisma.channelMembers.update({
            where: {
              id: searchedUser[0].id,
            },
            data: {
              isMuted: true,
            },
          });
          return { success: true, message: 'the user muted succesfully' };
          //mute the user (the user will be muted drom the admin ) // the ( isMuted)attribute in channelMembers will change to true
        }
      }
    }
  }
}
