import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { Response } from 'express';
import { updateUserRoleDto } from './dto/update-UserRole.dto';
export declare class ChannelService {
    private prismaService;
    constructor(prismaService: PrismaService);
    addChannel(createChannelDto: CreateChannelDto): Promise<{
        id: string;
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
}
