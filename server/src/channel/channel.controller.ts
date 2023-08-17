import { 
    Body,
    Controller,
    Delete, 
    Get, 
    Param,
    Patch,
    Post } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Response } from 'express';
import { Role } from '@prisma/client';
import { 
    CreateChannelDto, 
    createMessageChannelDto, 
    updateUserRoleDto, 
    userBanMuteDto} from './dto/channel.dto';

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

    // @Patch('/ban')
    // async banUser(@Body() userbanmuteDto:userBanMuteDto){
    //     return await this.channelService
    // }

    // @Patch('/kick')
    // async kickUser(@Body() userBanMuteDto:userBanMuteDto){
    //     return await this.channelService.
    // }

    // @Post('/ban')
    // async banUser(@Body() userBanMuteDto:userBanMuteDto){

    // }

    // @Post('/Mute')
    // async muteUser(@Body() userBanDto:userBanDto){

    // }

    @Post('/messages')
    async createMessage(@Body() createMsgDto:createMessageChannelDto){
        return await this.channelService.addMsgToChannel(createMsgDto);
    }
}
