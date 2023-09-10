import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    crednetials: true,
    namespace: 'chat',
  }
})

export class ChatGateway implements OnGatewayConnection{
  @WebSocketServer()
  server: Server;

  constructor(private authService: AuthService) { }

  private connectedUsers = new Map<string, Socket>();

  handleConnection(socket: Socket) {

  }

  @SubscribeMessage('message')
  handleMessage(socket: Socket, payload: string) {
    this.server.to(socket.id).emit('message', "Hello How are you");
  }


}
