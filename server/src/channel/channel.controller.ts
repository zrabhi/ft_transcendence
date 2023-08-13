import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { Channel, UserRole } from '@prisma/client';
import { createUserRoleDto } from './dto/create-UserRole.dto';
import { blockChannelUserDto } from './dto/blockChannelUser.dto';
import { createMessageChannelDto } from './dto/create-Message-channel.dto';

@Controller('api/channels')
export class ChannelController {
    constructor(private channelService: ChannelService){}

    @Post('/')
    async createChannel(@Body() createChannelDto:CreateChannelDto){
        return await this.channelService.addChannel(createChannelDto);
    }

    @Delete('/:channelId')
    async deleteChannel(@Param('channelId') channelId:string){
        return await this.channelService.deleteChannelById(channelId);
    }

    @Get('/:channelId/members')
    async getChannelMembers(@Param('channelId') channelId:string){
        return await this.channelService.getAllChannelMembers(channelId);
    }

    @Post('/members')
    async addUserToChannel(@Body() createUserRole:createUserRoleDto){
        return await this.channelService.addUserChannel(createUserRole);
    }

    // @Post('/ban')
    // async banUser(@Body() blockChannelUserdto: blockChannelUserDto){
    //     return await this.channelService.banUserById(blockChannelUserdto);
    // }

    @Delete('/kick')
    async kickUser(){

    }

    // mute user
    // join channel
    // leave channel
    
    @Post('/messages')
    async addMessage(@Body() createMsgChanDto:createMessageChannelDto){
        return await this.channelService.createMessage(createMsgChanDto);
    }

    @Get('/messages')
    async getChannelMessages(){
        return await this.channelService.getAllChannelMessage();
    }

    // @Get('/roles')
    // async getroles()
    // {
    //     return await this.channelService.getRoles();
    // }
    
    @Get('/:channelId')
    async getChannel(@Param('channelId') channelId:string):Promise<Channel>{
        return await this.channelService.getChannelById(channelId);
    }

    @Get('/:channelId/messages')
    async MsgOfChannel(@Param('channelId') channelId:string)
    {
        return await this.channelService.getMessagesByChannelId(channelId);
    }
    // @Post('/')
    // async createChannel(@Body() createChannelDto:CreateChannelDto){
    //     return await this.channelService.addChannel(createChannelDto);
    // }

    // @Delete('/:channelId')
    // async deleteChannel(@Param('channelId') channelId:string){
    //     return await this.channelService.deleteChannelById(channelId);
    // }
}
