import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { Role} from '@prisma/client';
import { createUserRoleDto } from './dto/create-UserRole.dto';
import { blockChannelUserDto } from './dto/blockChannelUser.dto';
import { createMessageChannelDto } from './dto/create-Message-channel.dto';

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
                },
                messages:{
                },
                restrictedUsers:{

                }
            },
            select:{id: true}
        })
    }

    async deleteChannelById(channelId:string){
        try{
            return await this.prismaService.channel.delete({
                where:{
                    id: channelId,
                },
                select:{id:true}
            })
        } catch(error)
        {
            throw new HttpException({
                status: HttpStatus.NO_CONTENT,
                error: `There is no content for this channel Id`,
            }, HttpStatus.NO_CONTENT, {
            })
        }
    }

    async getAllChannelMembers(channelId:string){
        return await this.prismaService.userRole.findMany({
            where:{
                channelId:channelId,
            },
            select:{userId:true}
        })
    }

    async addUserChannel(createUserRole:createUserRoleDto){
        let exist = !!await this.prismaService.userRole.findFirst({
            where: {
                userId: createUserRole.userId,
                channelId: createUserRole.channelId,
            }
        })

        if (exist)
        {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: `This user is already registred in the channel`,
            }, HttpStatus.FORBIDDEN)
        }

        return await this.prismaService.userRole.create({
            data:{
                userId:createUserRole.userId,
                channelId: createUserRole.channelId,
                role: createUserRole.role
            },
            select:{
                id:true
            }
        })
    }

    async getChannelById(channelId:string){
        return await this.prismaService.channel.findFirst({
            where:{
                id:channelId,
            }
        })
    }

    async createMessage(createMsgChanDto:createMessageChannelDto){
        return await this.prismaService.channel_message.create({
            data:{
                user_id:createMsgChanDto.user_id,
                channel_id:createMsgChanDto.channel_id,
                content:createMsgChanDto.content,
            }
        })
    }

    async getMessagesByChannelId(channelId:string){
        return await this.prismaService.channel_message.findMany({
            where:{
                channel_id:channelId,
            },
            orderBy:{
                created_at:'desc',
            }
        })
    }

}
