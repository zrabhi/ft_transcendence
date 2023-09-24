import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/Guards/AuthGurad';
import { UserInfo } from 'src/auth/decorator/user-decorator';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';

@WebSocketGateway({
  namespace: 'chat',
  cors:{
    origin: process.env.HOSTNAME,
    crednetials: true,
  }
})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server: Server;

  constructor(private authService: AuthService,
    private  jwtService: JwtService,
    private chatService: ChatService,
    private userService: UserService) { }


  private connectedUsers = new Map<Socket,User>();

 async handleConnection(client: Socket) {
  const payload = await this.jwtService.verifyAsync(client.handshake.auth.token,{
    secret: process.env.JWT_SECRET,
  })
  if (!payload)
    return client.disconnect(true);
  client.join(payload.username)
  const newUser = await this.userService.findUserName(payload.username);
  this.connectedUsers.set(client, newUser,);
  this.server.to(client.id).emit('connected', 'Hello world!');
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.delete(client)
    console.log(`Client disconnected   id ${client.id}`);
}
@SubscribeMessage('joinChat')
handleJoinChat(@ConnectedSocket() client: Socket,@MessageBody() data: any,)
{
  // console.log("client joined chat with ", data.id, this.connectedUsers.get(client));

  client.join(data.id);
}
  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any){
    const payload = await this.jwtService.verifyAsync(data.token,{
      secret: process.env.JWT_SECRET,
    })
    if (!payload)
        return client.disconnect(true);
    const user =await  this.userService.findUserById(payload.id);
    // console.log("uuuuu ",this.connectedUsers.get(client).avatar);

    const messageInfo = {
      reciever: user.username,
      avatar: user.avatar,
      content: data.message,
    };
    this.chatService.saveMessageToChannel(payload, data);
    console.log("im hereee message:", data.message);
    this.server.to(data.channelId).emit('message', messageInfo);
  }
}
