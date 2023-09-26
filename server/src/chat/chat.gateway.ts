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
    this.connectedUsers.delete(payload.id);
    console.log(`Client disconnected   id ${client.id}`);
  }
  @SubscribeMessage('joinChat')
  handleJoinChat(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    // console.log("client joined chat with ", data.id, this.connectedUsers.get(client));

    client.join(data.id);
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  @SubscribeMessage('leaveChannel')
  async handleLeveChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    // checking the access token of user is still valid if not the socket is the disconnected and the action not made
    const payload = await this.jwtService.verifyAsync(data.token, {
      secret: process.env.JWT_SECRET,
    });
    if (!payload) return client.disconnect(true);
    //TODO: handleLeave Channel here
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
    for (const member of channel.members) {
      if ((member.isBanned || member.isMuted) && member.userId === user.id) {
        console.log('im banned');
        return this.server.to(data.channelId).emit('muted or muted');
      }
    }
    const messageInfo = {
      reciever: user.username,
      avatar: user.avatar,
      content: data.message,
    };
    // for (const member of channel.members)
    // {
    //     if (member.userId != user.id)
    //     {

    //       this.server.to(member.userId).emit('lastMessage', messageInfo)}
    // }
    // console.log("uuuuu ",this.connectedUsers.get(client).avatar);

    this.chatService.saveMessageToChannel(payload, data);
    this.server.to(data.channelId).emit('message', messageInfo);
  }
}
