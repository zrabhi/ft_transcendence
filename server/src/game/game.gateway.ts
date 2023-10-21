import {
  JwtService
} from '@nestjs/jwt';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import {
  log
} from 'console';
import {
  Server,
  Socket
} from 'socket.io';
import {
  PrismaService
} from 'src/prisma/prisma.service';
import {
  UserService
} from 'src/user/user.service';


class Player {
  username: string;
  userid: string;
  avatar: string;
  score: number;
  socketid: string;
  side: string;
  bar: bar;
  match: Match;
  opponent: Player;
  opponent_bar: number;
  isready = false;
  isposed = false;
  isquit = false;
  isongame = false;
  socket: Socket;
  reserved = false;
  invited = false;

  constructor(socketid: string) {
      this.score = 0;
      this.socketid = socketid;
      this.opponent_bar = 0;
      this.bar = new bar();
  }
}

class Ball {
  x: number;
  y: number;
  addx: number;
  addy: number;
  width: number;
  constructor() {
      this.x = 0;
      this.y = 0;
      this.addx = 1;
      this.addy = 1;
      this.width = 10;
  }
};

class canvas {
  width: number;
  height: number;
  constructor(width: number, height: number) {
      this.width = width;
      this.height = height;
  }
}

class Match {
  rightplayer: Player;
  leftplayer: Player;
  ball: Ball;
  canvas: canvas;
  ingame = false;

  constructor(player1: Player, player2: Player, canvas: canvas) {
      this.rightplayer = player1;
      this.leftplayer = player2;
      this.ball = new Ball();
      this.canvas = canvas;
  }
}

class bar {
  x: number;
  y: number;
  starty: number;
  width: number;
  length: number;

  constructor() {
      this.x = 0;
      this.y = 0;
      this.starty = 0;
      this.width = 0;
      this.length = 0;
  }
}

class Queue {
  private items: Player[] = [];

  enqueue(item: Player): void {
      this.items.push(item);
  }

  dequeue(): Player | undefined {
      return this.items.shift();
  }

  isEmpty(): boolean {
      return this.items.length === 0;
  }

  size(): number {
      return this.items.length;
  }

  peek(): Player | undefined {
      return this.items[0];
  }

  removeBySocketId(socketId: string): void {
      const indexToRemove = this.items.findIndex((player) => player.socketid === socketId);
      if (indexToRemove !== -1) {
          this.items.splice(indexToRemove, 1);
      }
  }

  getByUserId(userId: string): Player | undefined {
      return this.items.find((player) => player.userid === userId);
  }

  containsUserId(userId: string): boolean {
      return this.items.some((player) => player.userid === userId);
  }

  removeByUserId(userId: string): void {
      const indexToRemove = this.items.findIndex((player) => player.userid === userId);
      if (indexToRemove !== -1) {
          this.items.splice(indexToRemove, 1);
      }
  }
}

function updateballxy(match: Match): string {
  try{
  if (match.ingame == false)
      return 'ok';
  if (match.ball.x + match.ball.addx > match.canvas.width) {
      match.leftplayer.score++;
      if (match.leftplayer.score == 4) {
          match.ingame = false;
          return ('left win');
      }
      match.ball.x = match.canvas.width / 2;
      match.ball.y = match.canvas.height / 2;
  } else if (match.ball.x + match.ball.addx < 0) {
      match.rightplayer.score++;
      if (match.rightplayer.score == 4) {
          match.ingame = false;
          return ('right win');
      }
      match.ball.x = match.canvas.width / 2;
      match.ball.y = match.canvas.height / 2;
  }

  if (match.ball.y + match.ball.addy > match.canvas.height || match.ball.y + match.ball.addy < 0)
      match.ball.addy = -match.ball.addy;
  if (
      match.ball.x + match.ball.width >= match.rightplayer.bar?.x &&
      match.ball.x <= match.rightplayer.bar.x + match.rightplayer.bar.width &&
      match.ball.y > match.rightplayer.bar.starty &&
      match.ball.y < match.rightplayer.bar.starty + match.rightplayer.bar.length) {
      if (match.ball.addx > 0)
          match.ball.addx = -match.ball.addx;
  } else if (
      match.ball.x <= match.leftplayer.bar?.x + match.leftplayer.bar?.width + match.ball.width &&
      match.ball.x >= match.leftplayer.bar.x &&
      match.ball.y > match.leftplayer.bar.starty &&
      match.ball.y < match.leftplayer.bar.starty + match.leftplayer.bar.length
  ) {
      if (match.ball.addx < 0)
          match.ball.addx = -match.ball.addx;
  }
  match.ball.x = match.ball.x + match.ball.addx;
  match.ball.y = match.ball.y + match.ball.addy;
  return 'ok'
}
catch(e){
  console.log("something went wrong")
  return "error"
}
}

@WebSocketGateway({
  namespace: "matching"
})
export class GameGateway {
  @WebSocketServer()
  server: Server;

  private waiting_users: Queue = new Queue;
  private invited_users: Queue = new Queue;

  private matchs: Match[] = [];
  private playing_users: Player[] = []

  constructor(
      private prismaService: PrismaService,
      private jwtService: JwtService,
      private userService: UserService,
  ) {}

  async handleConnection(client: Socket) {
      try {
          const payload = await this.jwtService.verifyAsync(
              client.handshake.auth.token, {
                  secret: process.env.JWT_SECRET,
              },
          );
          if (!payload) return client.disconnect(true);
          const currentUser = await this.userService.findUserById(payload.id)
          const socketId = client.id;
          const tmplayer = new Player(socketId);
          tmplayer.username = currentUser.username;
          tmplayer.avatar = currentUser.avatar;
          tmplayer.userid = currentUser.id;
          tmplayer.socket = client;
          console.log(`User connected to game gateway with ID: ${socketId}`)
          // console.log(this.waiting_users.getByUserId(tmplayer.userid));
          if(this.waiting_users.getByUserId(tmplayer.userid) != undefined)
          {
            client.disconnect(true);
            return;
          }
          await this.check_matching(tmplayer);
      } catch (err) {
          return client.disconnect(true);
      }
  }

  async handleDisconnect(client: Socket) {
    try{
      //TODO: UPDATE USER STATUS TO ONLINE
      const socketId = client.id;
      // console.log(this.playing_users[client.id]?.match);
      if(this.playing_users[client.id] && this.playing_users[client.id].match?.ingame === true)
      {
        this.playing_users[client.id].match.ingame = false;
        console.log('yes he is in the playing users ')
        this.server.to(this.playing_users[client.id].opponent.socketid).emit('opponent quit');
        let winner = this.playing_users[client.id].opponent;
        let loser = this.playing_users[client.id];
        winner.score = 3; loser.score = 0;
        await this.update_achivements(winner, loser, true);
        console.log("here we set the status t online")
        await this.userService.handleUpdateStatus('ONLINE', this.playing_users[client.id].userid);
        await this.userService.handleUpdateStatus('ONLINE', this.playing_users[client.id].opponent.userid);
        this.playing_users[this.playing_users[client.id]?.opponent?.socketid] = null;
        this.playing_users[client.id]  = null;
      }
      else
      {
        this.invited_users.removeBySocketId(client.id);
        this.waiting_users.removeBySocketId(client.id);
      }
      console.log(`User disconnected with ID: ${socketId}`);
    }catch(err){
      console.log("something went wrong")
    }
  }

  @SubscribeMessage('bar')
  async bar(@MessageBody() bar_y: number, @ConnectedSocket() client: Socket) {
      try{
          const currentPlayer = this.playing_users[client.id];
          if (currentPlayer && currentPlayer.opponent) {
              currentPlayer.opponent.opponent_bar = bar_y;
              currentPlayer.bar ? (currentPlayer.bar.starty = bar_y) : true;
              this.server.to(client.id).emit('match frame', {
                  oppy: currentPlayer.opponent_bar,
                  ballx: this.matchs[client.id].ball.x,
                  bally: this.matchs[client.id].ball.y,
                  myscore: this.playing_users[client.id].score,
                  oppscore: this.playing_users[client.id].opponent.score
              });
              let ret = updateballxy(this.matchs[client.id]);

              if (ret != 'ok') {
                  this.server.to(client.id).emit(ret);
                  this.server.to(this.playing_users[client.id].opponent.socketid).emit(ret);

                  let winner: Player;
                  let loser: Player;
                  let cleansheet = false;

                  if (ret == 'right win') {
                      winner = this.matchs[client.id].rightplayer;
                      loser = this.matchs[client.id].leftplayer;
                  } else {
                      winner = this.matchs[client.id].leftplayer;
                      loser = this.matchs[client.id].rightplayer;
                  }
                  if (loser.score == 0)
                      cleansheet = true;
                  this.update_achivements(winner, loser, cleansheet);
                  await this.userService.handleUpdateStatus('ONLINE', this.playing_users[client.id].userid);
                  await this.userService.handleUpdateStatus('ONLINE', this.playing_users[client.id].opponent.userid);
              }
          } else {
              console.error('Player or opponent is undefined.');
          }
        }catch(err)
        {
          console.log("error in bar message handling");
          client.disconnect();
        }
  }



@SubscribeMessage('init')
async init(@MessageBody() data: any, @ConnectedSocket() client: Socket){
  try{
    const match = this.matchs[client.id];
    match.canvas.width = data.canvasw;
    match.canvas.height = data.canvash;
    match.ball.x = match.canvas.width / 2;
    match.ball.y = match.canvas.height / 2;
    if(this.playing_users[client.id].bar)
    {
      console.log('server get init')
      if(this.playing_users[client.id].side == 'right')
        this.playing_users[client.id].bar.x = match.canvas.width - 115;
      else
        this.playing_users[client.id].bar.x = 100;
      this.playing_users[client.id].bar.length = 100;
      this.playing_users[client.id].bar.width = 15;
    }
    this.playing_users[client.id].isready = true;
    if(this.playing_users[client.id].isready && this.playing_users[client.id].isready)
    {

      this.server.to(client.id).emit('start');
      this.server.to(this.playing_users[client.id].opponent.socketid).emit('start');
      await this.userService.handleUpdateStatus('INGAME', this.playing_users[client.id].opponent.userid);
      await this.userService.handleUpdateStatus('INGAME', this.playing_users[client.id].userid);
    }
  }catch(err){
    console.log("something went wrong");
  }
}

private async check_matching(tmplayer:Player)
{
  try{
    const result = await this.userService.getInvitionAccpted(tmplayer.userid)
    if(result.success)
    {
      let i: number;
      let finded = false;

      for(i = 0; result.opponents[i]; i++)
      {
        if(this.invited_users.containsUserId(result.opponents[i].id))
        {
          finded = true;
          break;
        }
      }
      if(finded == true)
      {
        await this.userService.handleRemoveGameInvite(result.invitaionsId[i]);
        let rightplayer = tmplayer;
        let leftplayer = this.invited_users.getByUserId(result.opponents[i].id);
        rightplayer.side = 'right';
        leftplayer.side = 'left';
        this.invited_users.removeByUserId(result.opponents[i].id);
        rightplayer.opponent = leftplayer;
        leftplayer.opponent = rightplayer;
        this.playing_users[rightplayer.socketid] = rightplayer;
        this.playing_users[leftplayer.socketid] = leftplayer;
        let tmpmatch = new Match(rightplayer, leftplayer,  new canvas(1000,600));
        this.matchs[rightplayer.socketid] = tmpmatch;
        this.matchs[leftplayer.socketid] = tmpmatch;
        tmpmatch.ingame = true;
        rightplayer.match = tmpmatch;
        leftplayer.match = tmpmatch;
        this.server.to(rightplayer.socketid).emit('matched right', 
        {
          username : leftplayer.username,
          avatar:leftplayer.avatar
        });
        this.server.to(leftplayer.socketid).emit('matched left', 
        {
          username : rightplayer.username,
          avatar:rightplayer.avatar
        });
      }
      else
      {
        tmplayer.reserved = true;
        tmplayer.invited = true;
        this.invited_users.enqueue(tmplayer);
      }
    }
    else if (this.waiting_users.size() != 0)
    {
      let rightplayer = tmplayer;
      let leftplayer = this.waiting_users.peek();

      rightplayer.side = 'right';
      leftplayer.side = 'left';

      this.waiting_users.dequeue();
      rightplayer.opponent = leftplayer;
      leftplayer.opponent = rightplayer;
      this.playing_users[rightplayer.socketid] = rightplayer;
      this.playing_users[leftplayer.socketid] = leftplayer;
      let tmpmatch = new Match(rightplayer, leftplayer,  new canvas(1000,600));
      this.matchs[rightplayer.socketid] = tmpmatch;
      this.matchs[leftplayer.socketid] = tmpmatch;
      tmpmatch.ingame = true;
      rightplayer.match = tmpmatch;
      leftplayer.match = tmpmatch;
      this.server.to(rightplayer.socketid).emit('matched right',
      {
        username : leftplayer.username,
        avatar:leftplayer.avatar
      });
      this.server.to(leftplayer.socketid).emit('matched left',
      {
        username : rightplayer.username,
        avatar:rightplayer.avatar
      });
    }else{
      this.waiting_users.enqueue(tmplayer);
    }
  }catch(e)
  {
    console.log("something went wrong");
  }
}

async update_achivements(winner: Player, loser: Player, cleansheet:boolean)
{
    try {
    await this.prismaService.match.create({
      data:{
        winner_id: winner.userid,
        loser_id: loser.userid,
        winner_score: winner.score,
        loser_score: loser.score
      }
    })
    /// udpating winner user object
    const winnerUser = await this.userService.findUserById(winner.userid);
    await this.prismaService.user.update({
      where:{
        id: winner.userid,
      },
      data:{
        totalGames: winnerUser.totalGames +  1,
        win:winnerUser.win + 1,
        totalGoalsScored:winnerUser.totalGoalsScored +  winner.score,
        totalGoalsRecieved:winnerUser.totalGoalsRecieved + loser.score
      }
    })
    /// udpating loser user object
    const loserUser = await this.userService.findUserById(loser.userid);
    await this.prismaService.user.update({
      where:{
        id: loser.userid,
      },
      data:{
        totalGames:loserUser.totalGames + 1,
        loss:loserUser.loss+1,
        totalGoalsScored:loserUser.totalGoalsScored + loser.score,
        totalGoalsRecieved:loserUser.totalGoalsRecieved + winner.score
      }
    });
    await this.prismaService.achievement.update({
      where:{
        userId: winner.userid,
      },
      data:{
        firstGameAchie : true,
        firstWinAchie: true,
        cleanSheetGameAchie: cleansheet
      }
    })
    await this.prismaService.achievement.update({
      where:{
        userId: loser.userid,
      },
      data:{
        firstGameAchie : true,
        firstLoseAchie :true,
      }
    })}
    catch(err)
    {
      return {success: false, error:"error in updating achievements"}
    }
    }
}