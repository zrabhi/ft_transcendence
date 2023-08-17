import { ChannelService } from './channel.service';
import { Response } from 'express';
import { CreateChannelDto, createMessageChannelDto, updateUserRoleDto } from './dto/channel.dto';
export declare class ChannelController {
    private channelService;
    constructor(channelService: ChannelService);
    createChannel(createChannelDto: CreateChannelDto): Promise<{
        id: string;
        name: string;
        type: import(".prisma/client").$Enums.Type;
        password: string;
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
    createMessage(createMsgDto: createMessageChannelDto): Promise<{
        id: string;
    }>;
}
