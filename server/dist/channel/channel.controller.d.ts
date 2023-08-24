import { ChannelService } from './channel.service';
import { Response } from 'express';
import { CreateChannelDto, createMessageChannelDto, updateUserRoleDto, userBanMuteDto } from './dto/channel.dto';
export declare class ChannelController {
    private channelService;
    constructor(channelService: ChannelService);
    createChannel(createChannelDto: CreateChannelDto): Promise<{
        id: number;
        name: string;
        type: import(".prisma/client").$Enums.Type;
        password: string;
    }>;
    deleteChannel(channelId: string, res: Response): Promise<{
        id: number;
        name: string;
        type: import(".prisma/client").$Enums.Type;
        password: string;
    }>;
    leaveChannel(user_id: string, channelId: string): Promise<{
        id: number;
    }>;
    membersOfChannels(channelId: string): Promise<{
        id: number;
        userId: string;
        channelId: number;
        role: import(".prisma/client").$Enums.Role;
    }[]>;
    setRole(channelId: string, updateUserRoleDto: updateUserRoleDto): Promise<{
        id: number;
    }>;
    kickUser(userBanMuteDto: userBanMuteDto): Promise<{
        id: number;
    }>;
    banUser(userBanMuteDto: userBanMuteDto): Promise<{
        id: number;
        userId: string;
        channelId: number;
        isBanned: boolean;
        isKicked: boolean;
        isMute: boolean;
    }>;
    muteUser(userBanMuteDto: userBanMuteDto): Promise<void>;
    createMessage(createMsgDto: createMessageChannelDto): Promise<{
        id: number;
        channel_id: number;
        user_id: string;
        content: string;
        created_at: Date;
    }>;
    ChannelMessages(channelId: string): Promise<void>;
}
