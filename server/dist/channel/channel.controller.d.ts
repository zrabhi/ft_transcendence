import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { createMessageChannelDto } from './dto/create-Message-channel.dto';
export declare class ChannelController {
    private channelService;
    constructor(channelService: ChannelService);
    createChannel(createChannelDto: CreateChannelDto): Promise<{
        id: string;
    }>;
    getchannel(channelId: string): Promise<{
        id: string;
        name: string;
        type: import(".prisma/client").$Enums.Type;
        password: string;
    }>;
    deleteUserChannelDto(channelId: string): Promise<{
        id: string;
    }>;
    getChannelMessages(channelId: string): Promise<{
        id: string;
        channel_id: string;
        user_id: string;
        content: string;
        created_at: Date;
    }[]>;
    addMessages(createMsgChanDto: createMessageChannelDto): Promise<{
        id: string;
        channel_id: string;
        user_id: string;
        content: string;
        created_at: Date;
    }>;
}
