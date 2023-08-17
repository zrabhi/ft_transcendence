import { 
    HttpException,
    HttpStatus,
    Injectable, 
    NotFoundException,
    Param} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { Role} from '@prisma/client';
import { Response } from 'express';
import { updateUserRoleDto } from './dto/update-UserRole.dto';

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
            },
            select:{id: true}
        })
    }

    async deleteChannelById(channelId:string, res:Response){
        try{
            return await this.prismaService.channel.delete({
                where:{
                    id: channelId,
                },
                select:{id:true}
            })
        } catch(error)
        {
            res.status(HttpStatus.NO_CONTENT).json({error: 'No Content For this User'});
        }
    }

    async removeUserfromChannel(user_id:string, channel_id:string)
    {
        try{
            const exist = await this.prismaService.userRole.findFirstOrThrow({
                where:{
                    userId:user_id,
                    channelId:channel_id,
                },
                select:{
                    id:true
                }
            })
            if (exist)
            {
                return await this.prismaService.userRole.delete({
                    where:{
                        id:exist.id,
                    },
                    select:{
                        id:true,
                    }
                })
            }
        }
        catch (error)
        {
        throw new HttpException({
            status: HttpStatus.NO_CONTENT,
            error: 'There is no content for this User Role',
        }, HttpStatus.NO_CONTENT, {
            cause: error
        });
        }
    }

    async getMembersOfChannel(channelId:string)
    {
        return await this.prismaService.userRole.findMany({
            where:{
                channelId:channelId,
            },
            select:{
                userId:true,
                role:true,
            }
        })
    }

    async updateUserRole(channelId:string, updateUserRoleDto:updateUserRoleDto){
        try{
            const owner = await this.prismaService.userRole.findFirstOrThrow({
                where:{
                    userId:updateUserRoleDto.owner_id,
                    channelId:channelId,
                }
            })
            const exist = await this.prismaService.userRole.findFirstOrThrow({
                where:{
                    channelId:channelId,
                    userId:updateUserRoleDto.user_id
                },
                select:{
                    id:true
                }
            })
            if (exist)
            {
                return await this.prismaService.userRole.update({
                    where:{
                        id:exist.id,
                    },
                    data:{
                        role:updateUserRoleDto.role,
                    },
                    select:{
                        id:true
                    }
                })
            }
        }
        catch(error)
        {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Invalid owner Id',
            }, HttpStatus.BAD_REQUEST, {
                cause:error
            });
        }
    }
}
