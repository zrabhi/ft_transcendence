import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/Guards/AuthGurad';

@WebSocketGateway({
  cors: {
    origin: process.env.HOSTNAME,
    crednetials: true,
    namespace: 'chat',
  }
})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server: Server;

  constructor(private authService: AuthService) { }

  private connectedUsers = new Map<string, Socket>();

  handleConnection(client: Socket) {

    console.log(`Client connected  id ${client.id}`);

  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected   id ${client.id}`);
}
  @SubscribeMessage('message')
  @UseGuards(JwtAuthGuard)
  handleMessage(socket: Socket, @MessageBody() message: string, @Req() request){
    console.log(request.user);

    this.server.to(socket.id).emit('message', message);
  }


}
