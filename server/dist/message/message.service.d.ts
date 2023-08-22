import { PrismaService } from '../prisma/prisma.service';
import { createMessageDto } from './dto/create-message.dto';
export declare class MessageService {
    private prismaService;
    constructor(prismaService: PrismaService);
    addMessage(createMessageDto: createMessageDto): Promise<{
        id: number;
    }>;
    getMessageById(userId: string): Promise<{
        id: number;
        sender_id: string;
        reciever_id: string;
        content: string;
        created_at: Date;
    }[]>;
    getAllMessage(): Promise<{
        id: number;
        sender_id: string;
        reciever_id: string;
        content: string;
        created_at: Date;
    }[]>;
}
