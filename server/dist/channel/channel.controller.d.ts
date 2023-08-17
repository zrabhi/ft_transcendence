import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { Response } from 'express';
import { updateUserRoleDto } from './dto/update-UserRole.dto';
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
}
