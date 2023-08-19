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
import { 
    CreateChannelDto, 
    createMessageChannelDto, 
    updateUserRoleDto, 
    userBanMuteDto} from './dto/channel.dto';
import { setTimeout } from 'timers';

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

    @Patch('/kick')
    async kickUser(@Body() userBanMuteDto:userBanMuteDto){
        return await this.channelService.kickUser(userBanMuteDto);
    }

    @Post('/ban')
    async banUser(@Body() userBanMuteDto:userBanMuteDto){
        return await this.channelService.banUser(userBanMuteDto);
    }

    @Post('/mute')
    async muteUser(@Body() userBanMuteDto:userBanMuteDto){
        const channelMutedId = await this.channelService.muteUser(userBanMuteDto);
        setTimeout(async () => { await this.channelService.unmuteUser(channelMutedId.id)}, 30000);
    }

    @Post('/messages')
    async createMessage(@Body() createMsgDto:createMessageChannelDto){
        return await this.channelService.addMsgToChannel(createMsgDto);
    }

    @Get('/messages/:channelId')
    async ChannelMessages(@Param('channelId') channelId:string){
        return await this.channelService.getChannelMessagesById(channelId);
    }
}
