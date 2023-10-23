import { JwtService } from '@nestjs/jwt';
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
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

type userNode = {
  socket: Socket;
  id: string;
};
@WebSocketGateway({
  namespace: 'notifications',
  cors: {
    origin: process.env.HOSTNAME,
    crednetials: true,
  },
})
export class Invitations implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(
    private authService: AuthService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  private connectedUsers: userNode[] = [];
  async handleConnection(client: Socket) {
    try {
      const payload = await this.jwtService.verifyAsync(
        client.handshake.auth.token,
        {
          secret: process.env.JWT_SECRET,
        },
      );

      if (!payload) return client.disconnect(true);
      const current = await this.userService.findUserById(payload.id);
      if (current.status !== 'INGAME')
        await this.userService.handleUpdateStatus('ONLINE', payload.id);
      client.join(payload.id);
      this.connectedUsers.push({ socket: client, id: payload.id });
    } catch (err) {
      client.disconnect(true);
      return;
    }
  }

  async handleDisconnect(client: Socket) {
    try {
    // console.log("im diconnect status offline");
      const index = this.connectedUsers.findIndex(
        (user) => user.socket.id === client.id,
      );
      if (index > -1) {
        const sockets = this.connectedUsers.filter(
          (user) => user.id === this.connectedUsers[index].id,
        );
        if (sockets.length < 2)
          await this.userService.handleUpdateStatus(
            'OFFLINE',
            this.connectedUsers[index].id,
          );
        this.connectedUsers.splice(index, 1);
      }
    } catch (err) {}
  }

  @SubscribeMessage('FriendRequest')
  async handleFriendRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      const payload = await this.jwtService.verifyAsync(
        client.handshake.auth.token,
        {
          secret: process.env.JWT_SECRET,
        },
      );
      if (!payload) return client.disconnect(true);
      const currentUser = await this.userService.findUserById(payload.id);
      const invitedUser = await this.userService.findUserName(data.username);
      const result = await this.userService.handleFriendRequest(
        payload,
        data.username,
      );
      if (result.success) {
        const userSockets = this.connectedUsers.filter(
          (c) => c.id === invitedUser.id,
        );
        const dataSent = [];
        dataSent.push({
          type: 1,
          username: currentUser.username,
          avatar: currentUser.avatar,
        });
        userSockets.forEach((s) => {
          this.server.to(s.socket.id).emit('YouhaveFriendRequest', dataSent);
        });
        const SocketCurrentUser = this.connectedUsers.filter(
          (c) => c.id === currentUser.id,
        );
        SocketCurrentUser.forEach((s) => {
          this.server
            .to(s.socket.id)
            .emit('FriendRequestSent', { username: data.username });
        });
      }
    } catch (err) {}
  }
  @SubscribeMessage('AccepetFriendRequest')
  async handleAcceptFriendRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      const payload = await this.jwtService.verifyAsync(
        client.handshake.auth.token,
        {
          secret: process.env.JWT_SECRET,
        },
      );
      if (!payload) return client.disconnect(true);
      const currentUser = await this.userService.findUserById(payload.id);
      const invitedUser = await this.userService.findUserName(data.username);
      const result =  await this.userService.updateFriendRequestState(
          payload.id,
          data.username,
          'ACCEPTED',
        );
        if (result)
        {
          await this.userService.createFriendship(payload.id, data.username);
           const userSockets = this.connectedUsers.filter(
             (c) => c.id === invitedUser.id,
            );
          const dataSent = [];
          dataSent.push({
            type: 1,
            username: currentUser.username,
            avatar: currentUser.avatar,
          });
          userSockets.forEach((s) => {
            this.server.to(s.socket.id).emit('FriendRequestAccpeted', {username:data.username});
          });
          const SocketCurrentUser = this.connectedUsers.filter(
            (c) => c.id === currentUser.id,
          );
          SocketCurrentUser.forEach((s) => {
            this.server
             .to(s.socket.id)
              .emit('IsNowYourFriend', { username: currentUser.username });
        });
      }
    } catch (err) {}
    
  }

  @SubscribeMessage('gameInvite')
  async handleGameInvite(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      const payload = await this.jwtService.verifyAsync(
        client.handshake.auth.token,
        {
          secret: process.env.JWT_SECRET,
        },
      );
      if (!payload) return client.disconnect(true);
      const currentUser = await this.userService.findUserById(payload.id);
      const invitedUser = await this.userService.findUserName(data.username);
      const result = await this.userService.handleCreateGameInvitation(
        currentUser,
        invitedUser,
      );
      if (result.success) {
        const userSockets = this.connectedUsers.filter(
          (c) => c.id === invitedUser.id,
        );
        const userData = [];
        userData.push({
          type: 3,
          avatar: currentUser.avatar,
          username: currentUser.username,
        });
        userSockets.forEach((s) => {
          this.server.to(s.socket.id).emit('gameRequest', userData);
        });
        const SocketCurrentUser = this.connectedUsers.filter(
          (c) => c.id === currentUser.id,
        );
        SocketCurrentUser.forEach((s) => {
          this.server.to(s.socket.id).emit('gameRequestSent', userData);
        });
      }
    } catch (err) {
      client.disconnect(true);
      // console.log('socket error in game request', err);
    }
  }
  @SubscribeMessage('gameRefused')
  async handleRefuseGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      const payload = await this.jwtService.verifyAsync(
        client.handshake.auth.token,
        {
          secret: process.env.JWT_SECRET,
        },
      );
      if (!payload) return client.disconnect(true);
      const currentUser = await this.userService.findUserById(payload.id);
      const invitedUser = await this.userService.findUserName(data.username);
      const result = await this.userService.handleDeleteGameRequest(
        currentUser,
        invitedUser,
      );
      if (result.success) {
        const userSockets = this.connectedUsers.filter((c) => {
          return c.id === invitedUser.id;
        });
        userSockets.forEach((s) => {
          this.server
            .to(s.socket.id)
            .emit('userRefused', { username: currentUser.username });
        });
        const SocketCurrentUser = this.connectedUsers.filter(
          (c) => c.id === currentUser.id,
        );
        SocketCurrentUser.forEach((s) => {
          this.server
            .to(s.socket.id)
            .emit('Yourefused', { username: invitedUser.username });
        });
      }
    } catch (err) {
      client.disconnect(true);
      return;
    }
  }
  @SubscribeMessage('gameAccepted')
  async handleGameAccept(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      const payload = await this.jwtService.verifyAsync(
        client.handshake.auth.token,
        {
          secret: process.env.JWT_SECRET,
        },
      );
      if (!payload) return client.disconnect(true);
      const currentUser = await this.userService.findUserById(payload.id);
      const invitedUser = await this.userService.findUserName(data.username);
      const result = await this.userService.handleAccpetRequest(
        currentUser,
        invitedUser,
      );
      if (result.success) {
        const userSockets = this.connectedUsers.filter((c) => {
          return c.id === invitedUser.id;
        });
        userSockets.forEach((s) => {
          this.server
            .to(s.socket.id)
            .emit('userAccepted', { username: currentUser.username });
        });
        const SocketCurrentUser = this.connectedUsers.filter(
          (c) => c.id === currentUser.id,
        );
        SocketCurrentUser.forEach((s) => {
          this.server
            .to(s.socket.id)
            .emit('Youaccepted', { username: invitedUser.username });
        });
      }
    } catch (err) {
      client.disconnect(true);
      return;
    }
  }
  @SubscribeMessage('logout')
  async handleLogout(@ConnectedSocket() client: Socket) {
    try 
    {
      const { id } = this.connectedUsers.find((c) => c.socket.id === client.id);
      if (!id) return;
      // console.log('user id', id);
      await this.userService.handleUpdateStatus('OFFLINE', id);
      await this.userService.updateIsVerified(id);
      const userSockets = this.connectedUsers.filter((c) => c.id === id);
      if (userSockets.length === 0) return;
      userSockets.forEach(async (s) => {
        this.server.to(s.socket.id).emit('logout');
        s.socket.disconnect();
      });
    } catch (err) {}
  }
}
