import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { createMessageChannelDto } from './dto/create-Message-channel.dto';

@Controller('api/channels')
export class ChannelController {
    constructor(private channelService: ChannelService){}

    @Post('/')
    async createChannel(@Body() createChannelDto:CreateChannelDto){
        return await this.channelService.addChannel(createChannelDto);
    }

    @Get('/:channelId')
    async getchannel(@Param('channelId') channelId:string){
        return await this.channelService.getChannelById(channelId);
    }

    @Delete('/:channelId')
    async deleteUserChannelDto(@Param('channelId') channelId:string){
        return await this.channelService.deleteChannelById(channelId);
    }

    @Get('/:channelId/messages')
    async getChannelMessages(@Param('channelId') channelId : string){
        return await this.channelService.getMessagesByChannelId(channelId);
    }

    @Post('/messages')
    async addMessages(@Body() createMsgChanDto : createMessageChannelDto){
        return await this.channelService.createMessage(createMsgChanDto);
    }
}
