import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/Guards/AuthGurad';
import { UserInfo } from 'src/auth/decorator/user-decorator';
import { UserService } from 'src/user/user.service';
import { ChatService } from './chat.service';
import { createDmDto, getChannelDmDto, MessageInfo } from './dto/chat.dto';
import { channel } from 'diagnostics_channel';

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
  @Get('getMessages/:channelId/:username')
  async handleGetMessages(
    @Param('channelId') channelId: string,
    @Param('username') username: string,
    @Res() res,
  ) {
    const result = await this.chatService.getChannelMessages(
      channelId,
      username,
    );
    res.status(200).json(result);
  }
  @UseGuards(JwtAuthGuard)
  @Get('channels')
  async handleGetChannels(@Res() res, @UserInfo() user: User) {
    const result = (await this.chatService.getAllUserChannels(
      user.username,
    )) as any;
    const channels = [];
    for (const channel of result) {
      const searchedUserName = channel.users.filter((username) => {
        if (username != user.username) return username;
      });
      const lastMessage = channel.messages[channel.messages.length - 1];
      const searchedUser = await this.userService.findUserName(
        searchedUserName[0],
      );
      channels.push({
        username: searchedUser.username,
        avatar: searchedUser.avatar,
        message: lastMessage.content,
        status: searchedUser.status,
      });
    }
    console.log(channels);
    res.status(200).json(channels);
  }
}

// TODO : CREATE ALL GET RQUESTS TO GET CHATS
