import { PrismaService } from '../prisma/prisma.service';
import { createMessageDto } from './dto/create-message.dto';
export declare class MessageService {
    private prismaService;
    constructor(prismaService: PrismaService);
    addMessage(createMessageDto: createMessageDto): Promise<{
        id: string;
    }>;
    getMessageById(userId: string): Promise<{
        id: string;
        sender_id: string;
        reciever_id: string;
        content: string;
        created_at: Date;
    }[]>;
    getAllMessage(): Promise<{
        id: string;
        sender_id: string;
        reciever_id: string;
        content: string;
        created_at: Date;
    }[]>;
}
