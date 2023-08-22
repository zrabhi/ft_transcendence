import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { Response } from 'express';
import { CreateChannelDto, createMessageChannelDto, updateUserRoleDto, userBanMuteDto } from './dto/channel.dto';
export declare class ChannelService {
    private prismaService;
    constructor(prismaService: PrismaService);
    addChannel(createChannelDto: CreateChannelDto): Promise<{
        id: number;
        name: string;
        type: import(".prisma/client").$Enums.Type;
        password: string;
    }>;
    deleteChannelById(channelId: string, res: Response): Promise<{
        id: number;
        name: string;
        type: import(".prisma/client").$Enums.Type;
        password: string;
    }>;
    removeUserfromChannel(user_id: string, channel_id: string): Promise<{
        id: number;
    }>;
    getMembersOfChannel(channelId: string): Promise<{
        id: number;
        userId: string;
        channelId: number;
        role: import(".prisma/client").$Enums.Role;
    }[]>;
    updateUserRole(channelId: string, updateUserRoleDto: updateUserRoleDto): Promise<{
        id: number;
    }>;
    checkUserAvailability(userId: string): Promise<UserRole>;
    banMutePossibility(bannerRole: string, bannedRole: string): Boolean;
    function(userbanmuteDto: userBanMuteDto): Promise<void>;
    muteUser(userbanmuteDto: userBanMuteDto): Promise<{
        id: number;
        userId: string;
        channelId: number;
        isBanned: boolean;
        isKicked: boolean;
        isMute: boolean;
    }>;
    unmuteUser(channelBlockId: string): Promise<void>;
    banUser(userbanmuteDto: userBanMuteDto): Promise<{
        id: number;
        userId: string;
        channelId: number;
        isBanned: boolean;
        isKicked: boolean;
        isMute: boolean;
    }>;
    kickUser(userbanmuteDto: userBanMuteDto): Promise<{
        id: number;
    }>;
    addMsgToChannel(createMsgDto: createMessageChannelDto): Promise<{
        id: number;
        channel_id: number;
        user_id: string;
        content: string;
        created_at: Date;
    }>;
    getChannelMessagesById(channelId: string): Promise<void>;
}
