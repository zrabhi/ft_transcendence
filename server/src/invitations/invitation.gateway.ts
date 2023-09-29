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
    // private chatService: ChatService,
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
    try{
        await this.userService.handleUpdateStatus('ONLINE', payload.id)
    }catch(err)
    {
        // we will emit the error the event called (Notif error)   
    }
    client.join(payload.id);
    this.connectedUsers.set(payload.id, client);

    this.server.to(client.id).emit('connected', 'Hello world!');
  }

  async handleDisconnect(client: any) {

  }

  @SubscribeMessage('FriendRequest')
  async handleFriendRequest(@ConnectedSocket() client: Socket) {}
  // here we will add 3 events (game request, friend request, message request)
}
