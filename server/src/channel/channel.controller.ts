import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto, createMessageChannelDto, updateUserRoleDto, userBanMuteDto} from './dto/channel.dto';

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

    @Patch('/mute')
    async muteUser(@Body() userBanMuteDto:userBanMuteDto){
        const channelMutedId = await this.channelService.muteUser(userBanMuteDto);
        await new Promise(resolve => setTimeout(resolve, 50000));
        await this.channelService.unmuteUser(channelMutedId.userId);
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
