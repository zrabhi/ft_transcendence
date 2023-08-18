import { ChannelService } from './channel.service';
import { Response } from 'express';
import { CreateChannelDto, createMessageChannelDto, updateUserRoleDto, userBanMuteDto } from './dto/channel.dto';
export declare class ChannelController {
    private channelService;
    constructor(channelService: ChannelService);
    createChannel(createChannelDto: CreateChannelDto): Promise<{
        id: string;
    }>;
    deleteChannel(channelId: string, res: Response): Promise<{
        id: string;
    }>;
    leaveChannel(user_id: string, channelId: string): Promise<{
        id: string;
    }>;
    membersOfChannels(channelId: string): Promise<{
        role: import(".prisma/client").$Enums.Role;
        userId: string;
    }[]>;
    setRole(channelId: string, updateUserRoleDto: updateUserRoleDto): Promise<{
        id: string;
    }>;
    banUser(userBanMuteDto: userBanMuteDto): Promise<{
        id: string;
    }>;
    muteUser(userBanMuteDto: userBanMuteDto): Promise<void>;
    createMessage(createMsgDto: createMessageChannelDto): Promise<{
        id: string;
    }>;
    ChannelMessages(channelId: string): Promise<void>;
}
