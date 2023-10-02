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
import { channel } from 'diagnostics_channel';

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
  }

  async handleDisconnect(client: Socket) {
    const payload = await this.jwtService.verifyAsync(
      client.handshake.auth.token,
      {
        secret: process.env.JWT_SECRET,
      },
    );
    if (!payload) return client.disconnect(true);
    // this.server.to(payload.id).emit('disconnected', '');
    this.connectedUsers.delete(payload.id);
    // console.log(`Client disconnected   id ${client.id}`);
    // client.disconnect(true);
  }
  @SubscribeMessage('joinChat')
  handleJoinChat(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    // console.log("client joined chat with ", data.id, this.connectedUsers.get(client));

    client.join(data.id);
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  @SubscribeMessage('LeaveChannel')
  async handledLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
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
    // Todo: resturn error message id something  wrong happend
    for (const member of channel.members) {
      if (member.userId != user.id)
        this.server
          .to(member.userId)
          .emit('leftRoom', {
            channelName: channel.name,
            id: data.channelId,
            name: data.name
          });
    }
  }
  @SubscribeMessage('joinNewChannel')
  async handleJoinNewChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
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
      // error occured here
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
        channelName:channel.name,
        id: channel.members.length,
        name: currUser.username,
        status: currUser.status,
        avatar: currUser.avatar,
        role: 'Member',
      });
    }
  }
  @SubscribeMessage('addMember')
  async handleAddMmember(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    console.log('data =>', data);
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
  }
  @SubscribeMessage('deleteChannel')
  async handleDeletChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    // checking the access token of user is still valid if not the socket is the disconnected and the action not made
    const payload = await this.jwtService.verifyAsync(data.token, {
      secret: process.env.JWT_SECRET,
    });
    if (!payload) return client.disconnect(true);
    //TODO: handleLeave Channel here
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
  }
  @SubscribeMessage('mute')
  async handleMutedUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    // checking the access token of user is still valid if not the socket is the disconnected and the action not made
    const payload = await this.jwtService.verifyAsync(data.token, {
      secret: process.env.JWT_SECRET,
    });
    if (!payload) return client.disconnect(true);
    /// mute the user here
    try {
      await this.chatService.handleUserMute(
        payload,
        data.channel_id,
        data.username,
      );
    } catch (err) {}
  }
  @SubscribeMessage('ban')
  async handleBannedUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    // checking the access token of user is still valid if not the socket is the disconnected and the action not made
    const payload = await this.jwtService.verifyAsync(data.token, {
      secret: process.env.JWT_SECRET,
    });
    if (!payload) return client.disconnect(true);
    //TODO : HANDLE BAN ACTION HERE
  }
  @SubscribeMessage('block')
  async handleblockeedUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    // checking the access token of user is still valid if not the socket is the disconnected and the action not made
    const payload = await this.jwtService.verifyAsync(data.token, {
      secret: process.env.JWT_SECRET,
    });
    if (!payload) return client.disconnect(true);
    //TODO: HANDLE BLCOK ACTION HERE
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
    const user = await this.userService.findUserById(payload.id);
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
    for (const member of channel.members) {
      if ((member.isBanned || member.isMuted) && member.userId === user.id) {
        this.server.to(data.channelId).emit('muted or muted');
      }
      this.server.to(member.userId).emit('lastMessage', lastMessage);
    }
    this.chatService.saveMessageToChannel(payload, data);
    return this.server.to(data.channelId).emit('message', messageInfo);
  }
}
