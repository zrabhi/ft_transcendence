import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { Role, Type, UserRole } from '@prisma/client';

@Injectable()
export class ChannelService {
    constructor (private prismaService:PrismaService){}

    async addChannel(createChannelDto:CreateChannelDto){
        return await this.prismaService.channel.create({
            data:{
                name: createChannelDto.name,
                type: createChannelDto.type,
                roles:{
                    create:[
                        {
                            userId:createChannelDto.owner_id,
                            role:Role.OWNER
                        }
                    ]
                }
            }
        })
    }

    async deleteChannelById(channelId:string){
        // try{
            return await this.prismaService.channel.delete({
                where:{
                    id:channelId
                }
            })
        // }
        // catch (error)
        // {
        //     throw new HttpException({
        //         status: HttpStatus.NO_CONTENT,
        //         error: `There is no content for channel provided`,
        //     }, HttpStatus.NO_CONTENT, {
        //     })
        // }
    }

    async getChannelById(channelId:string){
        return await this.prismaService.channel.findFirst({
            where:{
                id:channelId,
            }
        })
    }

    async getRoles(){
        return await this.prismaService.userRole.findMany({      
        })
    }

}
