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
      await this.userService.handleUpdateStatus('ONLINE', payload.id);
      client.join(payload.id);
      this.connectedUsers.push({ socket: client, id: payload.id });
    } catch (err) {
      client.disconnect(true);
      return;
    }
  }

  async handleDisconnect(client: any) {
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
  }

  @SubscribeMessage('FriendRequest')
  async handleFriendRequest(@ConnectedSocket() client: Socket) {}

  @SubscribeMessage('logout')
  async handleLogout(@ConnectedSocket() client: Socket) {
    const { id } = this.connectedUsers.find((c) => c.socket.id === client.id);
    if (!id) return;
    const userSockets = this.connectedUsers.filter((c) => c.id === id);
    if (userSockets.length === 0) return;
    userSockets.forEach((s) => {
      this.server.to(s.socket.id).emit("logout");
      s.socket.disconnect();
    });
  }
}
