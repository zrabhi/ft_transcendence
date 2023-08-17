import { 
    Body,
    Controller,
    Delete, 
    Get, 
    Param,
    Patch,
    Post } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { Response } from 'express';
import { Role } from '@prisma/client';
import { updateUserRoleDto } from './dto/update-UserRole.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Controller('api/channels')
export class ChannelController {
    constructor(private channelService: ChannelService){}

    @Post('/')
    async createChannel(@Body() createChannelDto:CreateChannelDto){
        return await this.channelService.addChannel(createChannelDto);
    }

    @Delete('/:channelId')
    async deleteChannel(@Param('channelId') channelId:string, res:Response){
        return await this.channelService.deleteChannelById(channelId, res);
    }

    // @Post('/:channelId')
    // async joinChannel(){
    //     return await 
    // }

    @Delete('/:channelId/:user_id')
    async leaveChannel(@Param('user_id') user_id:string, @Param('channelId') channelId:string){
        return await this.channelService.removeUserfromChannel(user_id, channelId);
    }
    
    @Get('/:channelId/members')
    async membersOfChannels(@Param('channelId') channelId:string){
        return await this.channelService.getMembersOfChannel(channelId);
    }

    @Patch('/:channelId/role')
    async setRole(@Param('channelId') channelId:string, @Body() updateUserRoleDto:updateUserRoleDto){
        return await this.channelService.updateUserRole(channelId, updateUserRoleDto);
    }
}
