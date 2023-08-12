import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { Channel, UserRole } from '@prisma/client';

@Controller('api/channels')
export class ChannelController {
    constructor(private channelService: ChannelService){}

    @Get('/roles')
    async getroles()
    {
        return await this.channelService.getRoles();
    }
    
    @Get('/:channelId')
    async getChannel(@Param('channelId') channelId:string):Promise<Channel>{
        return await this.channelService.getChannelById(channelId);
    }

    @Post('/')
    async createChannel(@Body() createChannelDto:CreateChannelDto){
        return await this.channelService.addChannel(createChannelDto);
    }

    @Delete('/:channelId')
    async deleteChannel(@Param('channelId') channelId:string){
        return await this.channelService.deleteChannelById(channelId);
    }
}
