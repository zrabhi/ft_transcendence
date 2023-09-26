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
  banDto,
  createDmDto,
  createRoomDto,
  getChannelDmDto,
  MessageInfo,
} from './dto/chat.dto';
import { userInfo } from 'os';
import { channel } from 'diagnostics_channel';

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
    const members = [];
    members.push({
      username: result.user.username,
      avatar: result.user.avatar,
      status: result.user.status,
    });
    const data = {
      channel: result.channel,
      members: members,
    };
    res.status(200).json(data);
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
    console.log('create rooom result ', result);

    if (result.channel === undefined) return res.status(400).json(result.error);
    const members = [];
    members.push({
      name: result.user.username,
      avatar: result.user.avatar,
      status: result.user.status,
      role: 'Owner',
    });
    const data = {
      channel: result.channel,
      members: members,
    };
    return res.status(200).json(data);
  }

  @Put('leaveChannel/:channelId')
  @UseGuards(JwtAuthGuard)
  async handleLeaveChannel(
    @Param('channelId') channel_id: string,
    @Res() res: Response,
    @UserInfo() user: User,
  ) {
    const result = await this.chatService.handleLeaveChannel(user, channel_id);
    if (!result.success) return res.status(400).json(result);
    return res.status(200).json(result);
  }

  @Put('deleteChannel/:chennelID')
  @UseGuards(JwtAuthGuard)
  async handleDeleteChannel(
    @Param('chennelID') channel_id: string,
    @Res() res: Response,
    @UserInfo() user: User,
  ) {
    try {
      const currUser = await this.userService.findUserById(user.id);
      const result = await this.chatService.handleDeleteRoom(
        channel_id,
        currUser,
      );
      if (!result.success) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {}
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
  async handlegetChannelById(
    @Param('channleId') channleId: string,
    @Res() res: Response,
  ) {
    console.log('im here');

    const channel = await this.chatService.getChannelById(channleId);
    const members = [];
    for (const member of channel.members) {
      const user = await this.userService.findUserById(member.userId);
      let checker = 'Member';
      if (channel.owner === user.username) checker = 'Owner';
      else if (member.role === 'ADMIN') checker = 'Admin';
      members.push({
        name: user.username,
        avatar: user.avatar,
        status: user.status,
        role: checker,
      });
    }
    const data = {
      channel: channel,
      members: members,
    };
    res.status(200).json(data);
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
      user.id,
    );
    console.log('all messages here =>', result.allMessages);
    console.log('members are here =>', result.users);

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
    const currUser = await this.userService.findUserById(user.id);
    let result = (await this.chatService.getAllUserChannelsDm(currUser)) as any;

    const data = [];
    const channels = [];
    for (const channel of result) {
      const searchedUserName = channel.users.filter((username) => {
        if (username != currUser.username) return username;
      });
      const lastMessage = channel.messages[channel.messages.length - 1];
      if (!lastMessage) continue;
      const searchedUser = await this.userService.findUserName(
        searchedUserName[0],
      );
      data.push({
        type: 'dm',
        channel: {
          id: channel.id,
          username: searchedUser.username, /// it ay be deleteedd
          avatar: searchedUser.avatar,
          message: lastMessage.content,
          status: searchedUser.status,
        },
        members: {
          name: searchedUser.username,
          avatar: searchedUser.avatar,
          status: searchedUser.status,
        },
      });
      channels.push({
        id: channel.id,
        type: 'dm',
        username: searchedUser.username,
        avatar: searchedUser.avatar,
        message: lastMessage.content,
        status: searchedUser.status,
      });
    }
    res.status(200).json(data);
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
        type: 'room',
        channel: {
          id: channel.id,
          name: channel.name, /// it ay be deleteedd
          avatar: channel.avatar,
          message: lastMessage.content,
          status: '',
        },
        members: {
          name: searchedUser.username,
          avatar: searchedUser.avatar,
          status: searchedUser.status,
          role: 'Member',
        },
      });
      // channels.push({
      //   id: channel.id,
      //   type:"room",
      //   username: "#" + channel.name,
      //   avatar: searchedUser.avatar,
      //   message: lastMessage.content,
      //   status: searchedUser.status,
      // });
    }
    res.status(200).json(channels);
    //TODO get all rooms user in
  }

  @Get('LastMessages')
  @UseGuards(JwtAuthGuard)
  async handleGetUserLastMessages(
    @UserInfo() suer: User,
    @Res() res: Response,
  ) {
    // todo get all last messages
  }

  @Put('mute')
  @UseGuards(JwtAuthGuard)
  async handleBanUser(
    @UserInfo() user: User,
    @Res() res: Response,
    @Body() banInfo: banDto,
  ) {
    const { channel_id, username } = banInfo;
    const result = await this.chatService.handleUserMute(
      user,
      channel_id,
      username,
    );
    res.status(200).json(result);
  }
  @Put('setadmin/:channelId/:username')
  @UseGuards(JwtAuthGuard)
  async handleSetAdmin(
    @Param('username') username: string,
    @Param('channelId') channelId: string,
    @Res() res: Response,
    @UserInfo() user: User,
  ) {
    const result = await this.chatService.handleSetAsAdmin(
      user,
      channelId,
      username,
    );
    res.status(200).json(result);
    // handle set As Admin
  }
}
//TODO: GET ALL MESSAGES IN ON REQUEST

// TODO : CREATE ALL GET RQUESTS TO GET CHATS
//TODO: add time to messages senn
