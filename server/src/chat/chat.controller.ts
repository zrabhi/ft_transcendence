import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/Guards/AuthGurad';
import { UserInfo } from 'src/auth/decorator/user-decorator';
import { UserService } from 'src/user/user.service';
import { ChatService } from './chat.service';
import { createDmDto, MessageInfo} from './dto/chat.dto';

@Controller('chat')
export class ChatController {
    constructor(private userService: UserService,private chatService: ChatService) {}

    @Post('create/dm')
    @UseGuards(JwtAuthGuard)
    async handleCreateChannelDm(@UserInfo() user :User, @Res() res: Response, @Body() createDm)
    {
        // console.log(createDm);
        const result = await this.chatService.handleCreateDmChannel(user.id, createDm);
        console.log("dsdsadsae", result);
        res.status(200).json(result);
    }
    @UseGuards(JwtAuthGuard)
    @Post('saveMessage')
    async handleSaveMessageDm(@UserInfo() user :User, @Res() res: Response,@Body() messageInfo :MessageInfo)
    {
         await this.chatService.saveMessageToChannel(user, messageInfo);
         res.status(200).json("ok");
    }
}

// TODO : CREATE ALL GET RQUESTS TO GET CHATS