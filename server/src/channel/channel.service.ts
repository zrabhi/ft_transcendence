import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, Type, UserRole } from '@prisma/client';
import { CreateChannelDto, createMessageChannelDto, updateUserRoleDto, userBanMuteDto } from './dto/channel.dto';
import { Timeout } from '@nestjs/schedule';

@Injectable()
export class ChannelService {
    constructor (private prismaService:PrismaService){}

    async addChannel(createChannelDto:CreateChannelDto){
        try
        {
            await this.checkUserAvailability(createChannelDto.owner_id);
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
                    restrictedUsers:{
                        create:[
                            {
                                userId:createChannelDto.owner_id,
                                isBanned:false,
                                isMute:false,
                            }
                        ]
                    },
    
                },
                select:{id: true}
            })
        }
        catch (error)
        {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'The owner_id Provided not found',
            }, HttpStatus.BAD_REQUEST, {
                cause: error
            });
        }
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
                error: 'No Content For this Channel_Id',
            }, HttpStatus.NO_CONTENT, {
                cause:error
            });
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
                error: 'Invalid User Id',
            }, HttpStatus.BAD_REQUEST, {
                cause:error
            });
        }
    }
    
    async checkUserAvailability(userId:string):Promise<UserRole>
    {
        const user = await this.prismaService.userRole.findFirstOrThrow({
            where:{
                userId:userId,
            }
        })
        return (user);
    }

    banMutePossibility(bannerRole:string, bannedRole:string):Boolean{
        if (bannerRole == Role.MEMBER)
            return (false);
        if (bannerRole == Role.ADMIN && bannedRole == Role.OWNER)
            return (false);
        return true;
    }

    async function(userbanmuteDto:userBanMuteDto){
        try
        {
            const banner = await this.checkUserAvailability(userbanmuteDto.banner_id);
            const banned = await this.checkUserAvailability(userbanmuteDto.banned_id);
            if (banner.channelId !== banned.channelId)
            {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error:"users belongs to two Different channelIds", 
                }, HttpStatus.BAD_REQUEST);
            }
            if (!this.banMutePossibility(banner.role, banned.role))
            {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error:"You have not the privilege to ban this User", 
                }, HttpStatus.BAD_REQUEST);
            }
        }catch(error)
        {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: "Users requested not Found",
            }, HttpStatus.NOT_FOUND);
        }
    }
    // don't forget to give a meaninful name to function

    async muteUser(userbanmuteDto:userBanMuteDto){
        try{
            this.function(userbanmuteDto);
            const found = await this.prismaService.channelBlock.findFirst({
                where:{
                    userId:userbanmuteDto.banned_id,
                },
                select:{
                    id:true
                }
            })
            if (!found)
            {
                return await this.prismaService.channelBlock.create({
                    data:{
                        isMute:true,
                        user:{
                            connect:{
                                id:userbanmuteDto.banned_id,
                            }
                        },
                        channel:{
                            connect:{
                                id:userbanmuteDto.channel_id
                            }
                        }
                    },
                    select:{
                        userId:true,
                    }
                })
            }
            else
            {
                return await this.prismaService.channelBlock.update({
                    where:{
                        id:found.id
                    },
                    data:{
                        isMute:true
                    },
                    select:{
                        userId:true,
                    }
                })
            }
        }
        catch(error)
        {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error:"users provided are not founds", 
            }, HttpStatus.BAD_REQUEST);
        }
    }

    async unmuteUser(user_id:string){
        const user = await this.prismaService.channelBlock.findFirst({
            where:{
                userId:user_id,
            },
            select:{
                id:true,
            }
        })
        await this.prismaService.channelBlock.update({
            where:{
                id:user.id,
            },
            data:{
                isMute:false,
            }
        })
    }

    async banUser(userbanmuteDto:userBanMuteDto){
        try{
            this.function(userbanmuteDto);
            return await this.prismaService.channelBlock.create({
                data:{
                    isBanned:true,
                    user:{
                        connect:{
                            id:userbanmuteDto.banned_id,
                        }
                    },
                    channel:{
                        connect:{
                            id:userbanmuteDto.channel_id
                        }
                    }
                },
                select:{
                    id:true,
                }
            })
        }
        catch(error)
        {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error:"users provided are not founds", 
            }, HttpStatus.BAD_REQUEST);
        }
    }

    async kickUser(userbanmuteDto:userBanMuteDto){
        try
        {
            this.function(userbanmuteDto);
            return await this.removeUserfromChannel(userbanmuteDto.banned_id, userbanmuteDto.channel_id);
        }
        catch(error)
        {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error:"You cannot kick This User", 
            }, HttpStatus.FORBIDDEN);
        }
    }

    async addMsgToChannel(createMsgDto:createMessageChannelDto){
        try{
            await this.prismaService.userRole.findFirstOrThrow({
                where:{
                    userId:createMsgDto.user_id,
                    channelId:createMsgDto.channel_id
                }
            })
            await this.prismaService.channelBlock.findFirstOrThrow({
                where:{
                    userId:createMsgDto.user_id,
                    channelId:createMsgDto.channel_id,
                    AND:[
                        {isBanned:false},
                        {isMute:false}
                    ]
                }
            })
            return await this.prismaService.channel_message.create({
                data:{
                    content:createMsgDto.content,
                    user:{
                        connect:{
                            id:createMsgDto.user_id
                        }
                    },
                    channel:{
                        connect:{
                            id:createMsgDto.channel_id
                        }
                    }
                },
                select:{
                    id:true
                }
            })
        }
        catch(error)
        {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'user cannot send message',
            }, HttpStatus.FORBIDDEN, {
                cause:error
            });
        }
    }

    async getChannelMessagesById(channelId:string){
        const messages = await this.prismaService.channel_message.findMany({
            where:{
                channel_id:channelId
            },
            orderBy:{
                created_at:'desc',
            }
        })
        if (JSON.stringify(messages) === '[]')
        {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'messages not found',
            }, HttpStatus.NOT_FOUND);
        }
    }

}
