import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { createUserRoleDto } from './dto/create-UserRole.dto';
import { createMessageChannelDto } from './dto/create-Message-channel.dto';
export declare class ChannelService {
    private prismaService;
    constructor(prismaService: PrismaService);
    addChannel(createChannelDto: CreateChannelDto): Promise<{
        id: string;
    }>;
    deleteChannelById(channelId: string): Promise<{
        id: string;
    }>;
    getAllChannelMembers(channelId: string): Promise<{
        userId: string;
    }[]>;
    addUserChannel(createUserRole: createUserRoleDto): Promise<{
        id: string;
    }>;
    getChannelById(channelId: string): Promise<{
        id: string;
        name: string;
        type: import(".prisma/client").$Enums.Type;
        password: string;
    }>;
    createMessage(createMsgChanDto: createMessageChannelDto): Promise<{
        id: string;
        channel_id: string;
        user_id: string;
        content: string;
        created_at: Date;
    }>;
    getAllChannelMessage(): Promise<{
        id: string;
        channel_id: string;
        user_id: string;
        content: string;
        created_at: Date;
    }[]>;
    getMessagesByChannelId(channelId: string): Promise<{
        id: string;
        channel_id: string;
        user_id: string;
        content: string;
        created_at: Date;
    }[]>;
}
