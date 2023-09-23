import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/Guards/AuthGurad';
import { UserInfo } from 'src/auth/decorator/user-decorator';
import { UserService } from 'src/user/user.service';
import { ChatService } from './chat.service';
import {
  createDmDto,
  createRoomDto,
  getChannelDmDto,
  MessageInfo,
} from './dto/chat.dto';
import { userInfo } from 'os';

//TODO: CREATE GET BOTH DM AND ROOMS MESSAGES IN ON REQUEST
@Controller('chat')
export class ChatController {
  constructor(
    private userService: UserService,
    private chatService: ChatService,
  ) {}

  @Post('create/dm')
  @UseGuards(JwtAuthGuard)
  async handleCreateChannelDm(
    @UserInfo() user: User,
    @Res() res: Response,
    @Body() createDm,
  ) {
    const result = await this.chatService.handleCreateDmChannel(
      user.id,
      createDm,
    );
    res.status(200).json(result);
  }
  // @Get('getChannel/:channelName')
  // @UseGuards(JwtAuthGuard)
  // async handleGetChannel(@UserInfo() user: User, @Res() res: Response,
  // @Param('channelName') channelName: string)
  // {
  //   const result = await this.chatService.getCHannelRoom(channelName);
  //   res.status(200).json(result);
  // }

  @Post('create/room')
  @UseGuards(JwtAuthGuard)
  async handleCreateChannelRoom(
    @UserInfo() user: User,
    @Res() res: Response,
    @Body() createRoom: createRoomDto,
  ) {
    const result = await this.chatService.handleCreateRoomChannel(
      user.id,
      createRoom,
    );
    console.log("create rooom result ", result);

    if (result.channel === undefined) return res.status(400).json(result.error);
    const data = {
      channel: result.channel,
      members:  {
        username: result.user.username,
        avatar: result.user.avatar,
        status: result.user.status,
        owner: true,
      }
    }
    return res.status(200).json(data);
  }

  @Put('joinroom/:name/:password')
  @UseGuards(JwtAuthGuard)
  async handleJoinChannelRoom(
    @Param('name') name: string,
    @Param('password') password: string,
    @UserInfo() user: User,
    @Res() res: Response,
  ) {
    const result = await this.chatService.handleJoinChannelRoom(
      name,
      user,
      password,
    );
    if (result.channel === undefined) return res.status(400).json(result.error);
    return res.status(200).json(`${user.username} has joined channel`);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getChannel/:channleId')
  async handlegetChannelById(@Param('channleId') channleId:string, @Res() res: Response)
  {
    console.log("im here");
    
      const result =  await this.chatService.getChannelById(channleId);
      console.log("channleby id  found", result);
      res.status(200).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('saveMessage')
  async handleSaveMessageDm(
    @UserInfo() user: User,
    @Res() res: Response,
    @Body() messageInfo: MessageInfo,
  ) {
    await this.chatService.saveMessageToChannel(user, messageInfo);
    res.status(200).json('ok');
  }

  @UseGuards(JwtAuthGuard)
  @Get('getMessages/:channelId')
  async handleGetMessagesDm(
    @Param('channelId') channelId: string,
    @UserInfo() user: User,
    @Res() res: Response,
  ) {
    const result = await this.chatService.getChannelDmMessages(
      channelId,
      user.id
    );
    console.log("all messages here =>",result.allMessages);
    console.log("members are here =>",result.users);

    res.status(200).json(result);
  }
  @UseGuards(JwtAuthGuard)
  @Get('getMessages/:channelId')
  async handleGetMessagesRoom(
    @Param('channelId') channelId: string,
    @UserInfo() user: User,
    @Res() res: Response,
  ) {
    const result = await this.chatService.handleGetRoomMessages(
      channelId,
      user.id,
    );
    res.status(200).json(result);
  }
  @UseGuards(JwtAuthGuard)
  @Get('channelsDm')
  async handleGetChannelsDm(@Res() res: Response, @UserInfo() user: User) {
    const result = (await this.chatService.getAllUserChannelsDm(
      user.username,
    )) as any;

    const channels = [];
    for (const channel of result) {
      const searchedUserName = channel.users.filter((username) => {
        if (username != user.username) return username;
      });
      const lastMessage = channel.messages[channel.messages.length - 1];
      if (!lastMessage) continue;
      const searchedUser = await this.userService.findUserName(
        searchedUserName[0],
      );

      channels.push({
        id: channel.id,
        type: "dm",
        username: searchedUser.username,
        avatar: searchedUser.avatar,
        message: lastMessage.content,
        status: searchedUser.status,
      });
    }
    res.status(200).json(channels);
  }

  @Get('channelsRooms')
  @UseGuards(JwtAuthGuard)
  async handleGetChannelsRooms(@Res() res: Response, @UserInfo() user: User) {
    const result = await this.chatService.getAllChannelsRooms(user);

    const channels = [];
    for (const channel of result) {
      const lastMessage = channel.messages[channel.messages.length - 1];
      if (!lastMessage) continue;
      const searchedUser = await this.userService.findUserById(
        lastMessage.user_id,
      );
      channels.push({
        id: channel.id,
        type:"room",
        username: "#" + channel.name,
        avatar: searchedUser.avatar,
        message: lastMessage.content,
        status: searchedUser.status,
      });
    }
    res.status(200).json(channels);
    //TODO get all rooms user in
  }
}

// TODO : CREATE ALL GET RQUESTS TO GET CHATS
//TODO: add time to messages senn
