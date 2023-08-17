import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';
import { CreateChannelDto, createMessageChannelDto, updateUserRoleDto } from './dto/channel.dto';
export declare class ChannelService {
    private prismaService;
    constructor(prismaService: PrismaService);
    addChannel(createChannelDto: CreateChannelDto): Promise<{
        id: string;
        name: string;
        type: import(".prisma/client").$Enums.Type;
        password: string;
    }>;
    deleteChannelById(channelId: string, res: Response): Promise<{
        id: string;
    }>;
    removeUserfromChannel(user_id: string, channel_id: string): Promise<{
        id: string;
    }>;
    getMembersOfChannel(channelId: string): Promise<{
        role: import(".prisma/client").$Enums.Role;
        userId: string;
    }[]>;
    updateUserRole(channelId: string, updateUserRoleDto: updateUserRoleDto): Promise<{
        id: string;
    }>;
    addMsgToChannel(createMsgDto: createMessageChannelDto): Promise<{
        id: string;
    }>;
}
