import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/Guards/AuthGurad';
import { UserInfo } from 'src/auth/decorator/user-decorator';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { channel, subscribe } from 'diagnostics_channel';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: process.env.HOSTNAME,
    crednetials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private chatService: ChatService,
    private userService: UserService,
  ) {}

  private connectedUsers = new Map<String, Socket>();

  async handleConnection(client: Socket) {
    try {
      const payload = await this.jwtService.verifyAsync(
        client.handshake.auth.token,
        {
          secret: process.env.JWT_SECRET,
        },
      );
      if (!payload) return client.disconnect(true);
      client.join(payload.id);
      // const newUser = await this.userService.findUserById(payload.id);
      this.connectedUsers.set(payload.id, client);
      this.server.to(client.id).emit('connected', 'Hello world!');
    } catch (err) {
      console.log('error while trying to connect');
      return client.disconnect(true);
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const payload = await this.jwtService.verifyAsync(
        client.handshake.auth.token,
        {
          secret: process.env.JWT_SECRET,
        },
      );
      if (!payload) return client.disconnect(true);
      // this.server.to(payload.id).emit('disconnected', '');
      this.connectedUsers.delete(payload.id);
    } catch (err) {
      return client.disconnect(true);
    }
    // console.log(`Client disconnected   id ${client.id}`);
    // client.disconnect(true);
  }
  @SubscribeMessage('joinChat')
  handleJoinChat(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    // console.log("client joined chat with ", data.id, this.connectedUsers.get(client));

    client.join(data.id);
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  @SubscribeMessage('setAdmin')
  async handleSetAdmin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      const payload = await this.jwtService.verifyAsync(data.token, {
        secret: process.env.JWT_SECRET,
      });
      if (!payload) return client.disconnect(true);
      const user = await this.userService.findUserById(payload.id);
      const result = await this.chatService.handleSetAsAdmin(
        payload,
        data.channelId,
        data.username,
      );
      if (!result?.success) {
        return;
      }
      const channel = await this.prismaService.channel.findUnique({
        where: {
          id: data.channelId,
        },
        include: {
          members: true,
        },
      });
      for (const member of channel.members) {
        this.server
          .to(member.userId)
          .emit('newAdmin', { channelName: channel.name, user: data.username });
      }
    } catch (err) {
      return client.disconnect(true);
    }
  }
  @SubscribeMessage('LeaveChannel')
  async handledLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      const payload = await this.jwtService.verifyAsync(data.token, {
        secret: process.env.JWT_SECRET,
      });
      if (!payload) return client.disconnect(true);
      const user = await this.userService.findUserById(payload.id);
      const channel = await this.prismaService.channel.findUnique({
        where: {
          id: data.channelId,
        },
        include: {
          members: true,
        },
      });
      for (const member of channel.members) {
        if (member.userId != user.id)
          this.server.to(member.userId).emit('leftRoom', {
            channelName: channel.name,
            id: data.channelId,
            name: data.name,
          });
      }
    } catch (err) {
      return client.disconnect(true);
    }
  }

  @SubscribeMessage('joinNewChannel')
  async handleJoinNewChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      const payload = await this.jwtService.verifyAsync(data.token, {
        secret: process.env.JWT_SECRET,
      });
      if (!payload) return client.disconnect(true);
      const result = await this.chatService.handleJoinChannelRoom(
        data.channelName,
        payload,
        data.password,
      );
      if (result.channel === undefined) {
        return;
      }
      const currUser = await this.userService.findUserById(payload.id);
      const channel = await this.prismaService.channel.findUnique({
        where: {
          id: result.channel.id,
        },
        include: {
          members: true,
        },
      });
      for (const member of channel.members) {
        this.server.to(member.userId).emit('memberJoinned', {
          channelId: channel.id,
          channelName: channel.name,
          id: channel.members.length,
          name: currUser.username,
          status: currUser.status,
          avatar: currUser.avatar,
          role: 'Member',
        });
      }
    } catch (err) {
      return client.disconnect(true);
    }
  }
  @SubscribeMessage('addMember')
  async handleAddMmember(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      const payload = await this.jwtService.verifyAsync(data.token, {
        secret: process.env.JWT_SECRET,
      });
      if (!payload) return client.disconnect(true);
      const result = await this.chatService.handleAddMember(
        payload,
        data.channelId,
        data.username,
      );
      const channel = await this.prismaService.channel.findUnique({
        where: {
          id: data.channelId,
        },
        include: {
          members: true,
        },
      });
      const addedUser = await this.userService.findUserName(data.username);
      // check if there is multiple users to be added
      if (result.success) {
        for (const member of channel.members) {
          this.server.to(member.userId).emit('NewMember', {
            channelName: channel.name,
            member: data.username,
            role: 'Member',
            avatar: addedUser.avatar,
            status: addedUser.status,
            id: channel.members[channel.members.length - 1],
            lastMessage: result.lastMessage,
          });
        }
      } else {
        this.server
          .to(payload.id)
          .emit('error occored', { errorMessage: result?.error });
      }
    } catch (err) {
      return client.disconnect(true);
    }
  }
  @SubscribeMessage('deleteChannel')
  async handleDeletChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      const payload = await this.jwtService.verifyAsync(data.token, {
        secret: process.env.JWT_SECRET,
      });
      if (!payload) return client.disconnect(true);
      const user = await this.userService.findUserById(payload.id);
      const channel = await this.prismaService.channel.findUnique({
        where: {
          id: data.channelId,
        },
        include: {
          members: true,
        },
      });
      const result = (await this.chatService.handleDeleteRoom(
        data.channelId,
        user,
      )) as any;
      const response = {
        channelId: data.channelId,
        name: channel.name,
        username: user.username,
        success: result.success,
        error: result.error,
      };
      // Todo: return error message id something  wrong happend
      for (const member of channel.members) {
        this.server.to(member.userId).emit('channelDeleted', response);
      }
    } catch (err) {
      return client.disconnect(true);
    }
  }
  @SubscribeMessage('mute')
  async handleMutedUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      const payload = await this.jwtService.verifyAsync(data.token, {
        secret: process.env.JWT_SECRET,
      });
      if (!payload) return client.disconnect(true);
      /// mute the user here
      console.log('im hereee');
      await this.chatService.handleUserMute(
        payload,
        data.channel_id,
        data.username,
      );
      const channel = await this.prismaService.channel.findUnique({
        where: {
          id: data.channel_id,
        },
        include: {
          members: true,
        },
      });
      for (const member of channel.members) {
        this.server.to(member.userId).emit('userMuted', {
          channelName: channel.name,
          user: data.username,
        });
      }
    } catch (err) {
      console.log(err);

      return client.disconnect(true);
    }
  }
  @SubscribeMessage('unban')
  async handleUnbanUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      const payload = await this.jwtService.verifyAsync(data.token, {
        secret: process.env.JWT_SECRET,
      });
      if (!payload) return client.disconnect(true);
      const bannedUser = await this.userService.findUserName(data.username);
      const result = await this.chatService.handleUnbanUser(
        payload,
        data.channelId,
        data.username,
      );
      if (!result.success) {
        // error ocured here
        return;
      }
      for (const member of result.channel.members) {
        this.server
          .to(member.userId)
          .emit('UserUnbanned', {
            id: result.channel.id,
            channelName: result.channel.name,
            username: bannedUser.username,
          });
      }
      return this.server
        .to(bannedUser.id)
        .emit('UserUnbanned', {
          id: result.channel.id,
          channelName: result.channel.name,
          username: bannedUser.username,
        });
    } catch (err) {
      return client.disconnect(true);
    }
  }
  @SubscribeMessage('ban')
  async handleBannedUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      const payload = await this.jwtService.verifyAsync(data.token, {
        secret: process.env.JWT_SECRET,
      });
      if (!payload) return client.disconnect(true);
      const bannedUser = await this.userService.findUserName(data.username);
      const result = await this.chatService.handleBanUser(
        payload,
        data.channelId,
        data.username,
      );
      if (!result.success) {
        // error ocured here
        return;
      }
      const channel = await this.prismaService.channel.findUnique({
        where: {
          id: data.channelId,
        },
        include: {
          members: true,
        },
      });
      const Sentdata = {
        channelId: channel.id,
        channelName: channel.name,
        name: bannedUser.username,
      };
      for (const member of channel.members) {
        this.server.to(member.userId).emit('userBanned', Sentdata);
      }
      return this.server.to(bannedUser.id).emit('yourBanned', Sentdata);
    } catch (err) {
      return client.disconnect(true);
    }
  }
  @SubscribeMessage('kick')
  async handleKickUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      const payload = await this.jwtService.verifyAsync(data.token, {
        secret: process.env.JWT_SECRET,
      });
      if (!payload) return client.disconnect(true);
      const kickedUser = await this.userService.findUserName(data.username);
      const result = await this.chatService.handleKickUser(
        payload,
        data.channelId,
        data.username,
      );
      if (!result.success) {
        return;
      }
      const channel = await this.prismaService.channel.findUnique({
        where: {
          id: data.channelId,
        },
        include: {
          members: true,
        },
      });
      const Sentdata = {
        channelId: channel.id,
        channelName: channel.name,
        name: kickedUser.username,
      };
      for (const member of channel.members) {
        this.server.to(member.userId).emit('userKicked', Sentdata);
      }
      return this.server.to(kickedUser.id).emit('yourKicked', Sentdata);
    } catch (err) {
      return client.disconnect(true);
    }
  }
  @SubscribeMessage('unblock')
  async handleUblockUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      const payload = await this.jwtService.verifyAsync(data.token, {
        secret: process.env.JWT_SECRET,
      });
      if (!payload) return client.disconnect(true);
      const result = await this.userService.handleUnBlockUser(
        payload,
        data.username,
      );
      if (!result.success) {
        return;
      }
      const currUser = await this.userService.findUserById(payload.id)
      const otherUser = await this.userService.findUserName(data.username)
      
      this.server.to(payload.id).emit('userUnBlocked',{username: data.username});
      return this.server.to(otherUser.id).emit('yourUnBlocked',{username: currUser.username});
    } catch (e) {
      return client.disconnect(true);
    }
  }
  @SubscribeMessage('block')
  async handleblockeedUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      const payload = await this.jwtService.verifyAsync(data.token, {
        secret: process.env.JWT_SECRET,
      });
      if (!payload) return client.disconnect(true);
      const current = await this.userService.findUserById(payload.id);
      const result = await this.userService.handleBlockUser(
        payload,
        data.username,
      );
      if (!result.success) {
        return;
      }
      const otherUser = await this.userService.findUserName(data.username);
      this.server
        .to(otherUser.id)
        .emit('yourBlocked', { username: current.username });
      return this.server
        .to(payload.id)
        .emit('userBlocked', { username: data.username });
    } catch (e) {
      return client.disconnect(true);
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const payload = await this.jwtService.verifyAsync(data.token, {
      secret: process.env.JWT_SECRET,
    });
    if (!payload) return client.disconnect(true);
    const user = await this.prismaService.user.findUnique({
      where: {
        id: payload.id,
      },
      include: {
        userBlock: true,
        blockedUser: true,
      },
    });

    await this.chatService.handleAutoUnmute();
    const channel = await this.prismaService.channel.findUnique({
      where: {
        id: data.channelId,
      },
      include: {
        members: true,
      },
    });
    let type: string = 'dm';
    let name: string = user.username;
    let status: string = user.status;
    let avatar: string = user.avatar;
    if (channel.type != 'DM')
      (type = 'room'),
        (name = '#' + channel.name),
        (status = ''),
        (avatar = channel.avatar);
    const lastMessage = {
      type: type,
      channel: {
        id: data.channelId,
        username: name,
        avatar: avatar,
        message: data.message,
        status: status,
      },
    };
    const messageInfo = {
      type: type,
      channelId: data.channelId,
      reciever: user.username,
      avatar: user.avatar,
      content: data.message,
    };
    if (channel.type === 'DM') {
      for (const member of channel.members) {
        for (const blocked of user.userBlock) {
          if (blocked.blockedId === member.userId)
            return this.server.to(user.id).emit('messageBlocked', {});
        }
        for (const blocked of user.blockedUser) {
          if (blocked.blockedId === user.id)
            return this.server.to(user.id).emit('blockedUser', {});
        }
      }
    }
    for (const member of channel.members) {
      if (member.isMuted && member.userId === user.id) {
        this.server
          .to(member.userId)
          .emit('Yourmuted', { channelName: channel.name });
        return;
      }
    }
    for (const member of channel.members) {
      this.server.to(member.userId).emit('lastMessage', lastMessage);
    }
    this.chatService.saveMessageToChannel(payload, data);
    return this.server.to(data.channelId).emit('message', messageInfo);
  }
}
