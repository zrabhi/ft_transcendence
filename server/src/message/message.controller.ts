import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { createMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from 'src/auth/Guards/AuthGurad';

@Controller('/api/messages/')
export class MessageController {
    constructor(private messageService: MessageService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/')
    async createMessage(@Body() createMessageDto:createMessageDto){
        return await this.messageService.addMessage(createMessageDto);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('/')
    async getMessages(){
        return await this.messageService.getAllMessage();
    }
    @UseGuards(JwtAuthGuard)
    @Get('/:userId') // change it to username
    async getMessageByUserId(@Param('userId') userId:string){
        return await this.messageService.getMessageById(userId);
    }
}
