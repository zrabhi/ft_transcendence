import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { createMessageDto } from './dto/create-message.dto';

@Controller('/api/messages/')
export class MessageController {
    constructor(private messageService: MessageService) {}

    @Post('/')
    async createMessage(@Body() createMessageDto:createMessageDto){
        return await this.messageService.addMessage(createMessageDto);
    }

    @Get('/')
    async getMessages(){
        return await this.messageService.getAllMessage();
    }

    @Get('/:userId')
    async getMessageByUserId(@Param('userId') userId:string){
        return await this.messageService.getMessageById(userId);
    }
}
