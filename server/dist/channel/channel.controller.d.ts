import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { Channel } from '@prisma/client';
import { createUserRoleDto } from './dto/create-UserRole.dto';
import { createMessageChannelDto } from './dto/create-Message-channel.dto';
export declare class ChannelController {
    private channelService;
    constructor(channelService: ChannelService);
    createChannel(createChannelDto: CreateChannelDto): Promise<{
        id: string;
    }>;
    deleteChannel(channelId: string): Promise<{
        id: string;
    }>;
    getChannelMembers(channelId: string): Promise<{
        userId: string;
    }[]>;
    addUserToChannel(createUserRole: createUserRoleDto): Promise<{
        id: string;
    }>;
    kickUser(): Promise<void>;
    addMessage(createMsgChanDto: createMessageChannelDto): Promise<{
        id: string;
        channel_id: string;
        user_id: string;
        content: string;
        created_at: Date;
    }>;
    getChannelMessages(): Promise<{
        id: string;
        channel_id: string;
        user_id: string;
        content: string;
        created_at: Date;
    }[]>;
    getChannel(channelId: string): Promise<Channel>;
    MsgOfChannel(channelId: string): Promise<{
        id: string;
        channel_id: string;
        user_id: string;
        content: string;
        created_at: Date;
    }[]>;
}
