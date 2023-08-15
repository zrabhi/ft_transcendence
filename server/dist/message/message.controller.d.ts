import { MessageService } from './message.service';
import { createMessageDto } from './dto/create-message.dto';
export declare class MessageController {
    private messageService;
    constructor(messageService: MessageService);
    createMessage(createMessageDto: createMessageDto): Promise<{
        id: string;
    }>;
    getMessages(): Promise<{
        id: string;
        sender_id: string;
        reciever_id: string;
        content: string;
        created_at: Date;
    }[]>;
    getMessageByUserId(userId: string): Promise<{
        id: string;
        sender_id: string;
        reciever_id: string;
        content: string;
        created_at: Date;
    }[]>;
}
