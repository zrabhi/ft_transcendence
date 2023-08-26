import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
    constructor(private prismaService:PrismaService){}
    
    async addMessage(createMessageDto:createMessageDto){
        return await this.prismaService.message.create({
            data:{
                sender_id:createMessageDto.senderId,
                reciever_id:createMessageDto.recieverId,
                content:createMessageDto.content
            },
            select:{id:true}
        })
    }

    async getMessageById(userId:string){
        return await this.prismaService.message.findMany({
            where:{
                OR:[
                    {sender_id: userId},
                    {reciever_id: userId}
                ]
            },
            orderBy:{
                created_at: 'desc'
            }
        })
    }

    async getAllMessage(){
        return await this.prismaService.message.findMany({
        })
    }
}
