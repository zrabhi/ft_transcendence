"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ChannelService = exports.ChannelService = class ChannelService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async addChannel(createChannelDto) {
        return await this.prismaService.channel.create({
            data: {
                name: createChannelDto.name,
                type: createChannelDto.type,
                roles: {
                    create: [
                        {
                            userId: createChannelDto.owner_id,
                            role: client_1.Role.OWNER
                        }
                    ]
                },
                restrictedUsers: {
                    create: [
                        {
                            userId: createChannelDto.owner_id,
                            isBanned: false,
                            isMute: false,
                        }
                    ]
                },
            },
            select: { id: true }
        });
    }
    async deleteChannelById(channelId, res) {
        try {
            return await this.prismaService.channel.delete({
                where: {
                    id: channelId,
                },
                select: { id: true }
            });
        }
        catch (error) {
            res.status(common_1.HttpStatus.NO_CONTENT).json({ error: 'No Content For this User' });
        }
    }
    async removeUserfromChannel(user_id, channel_id) {
        try {
            const exist = await this.prismaService.userRole.findFirstOrThrow({
                where: {
                    userId: user_id,
                    channelId: channel_id,
                },
                select: {
                    id: true
                }
            });
            if (exist) {
                return await this.prismaService.userRole.delete({
                    where: {
                        id: exist.id,
                    },
                    select: {
                        id: true,
                    }
                });
            }
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NO_CONTENT,
                error: 'There is no content for this User Role',
            }, common_1.HttpStatus.NO_CONTENT, {
                cause: error
            });
        }
    }
    async getMembersOfChannel(channelId) {
        return await this.prismaService.userRole.findMany({
            where: {
                channelId: channelId,
            },
            select: {
                userId: true,
                role: true,
            }
        });
    }
    async updateUserRole(channelId, updateUserRoleDto) {
        try {
            const owner = await this.prismaService.userRole.findFirstOrThrow({
                where: {
                    userId: updateUserRoleDto.owner_id,
                    channelId: channelId,
                }
            });
            const exist = await this.prismaService.userRole.findFirstOrThrow({
                where: {
                    channelId: channelId,
                    userId: updateUserRoleDto.user_id
                },
                select: {
                    id: true
                }
            });
            if (exist) {
                return await this.prismaService.userRole.update({
                    where: {
                        id: exist.id,
                    },
                    data: {
                        role: updateUserRoleDto.role,
                    },
                    select: {
                        id: true
                    }
                });
            }
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                error: 'Invalid owner Id',
            }, common_1.HttpStatus.BAD_REQUEST, {
                cause: error
            });
        }
    }
    async addMsgToChannel(createMsgDto) {
        try {
            await this.prismaService.userRole.findFirstOrThrow({
                where: {
                    userId: createMsgDto.user_id,
                    channelId: createMsgDto.channel_id
                }
            });
            await this.prismaService.channelBlock.findFirstOrThrow({
                where: {
                    userId: createMsgDto.user_id,
                    channelId: createMsgDto.channel_id,
                    AND: [
                        { isBanned: false },
                        { isMute: false }
                    ]
                }
            });
            return await this.prismaService.channel_message.create({
                data: {
                    content: createMsgDto.content,
                    user: {
                        connect: {
                            id: createMsgDto.user_id
                        }
                    },
                    channel: {
                        connect: {
                            id: createMsgDto.channel_id
                        }
                    }
                },
                select: {
                    id: true
                }
            });
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.FORBIDDEN,
                error: 'user cannot send message',
            }, common_1.HttpStatus.FORBIDDEN, {
                cause: error
            });
        }
    }
    async getChannelMessagesById(channelId) {
        const messages = await this.prismaService.channel_message.findMany({
            where: {
                channel_id: channelId
            },
            orderBy: {
                created_at: 'desc',
            }
        });
        if (JSON.stringify(messages) === '[]') {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                error: 'messages not found',
            }, common_1.HttpStatus.NOT_FOUND);
        }
    }
};
exports.ChannelService = ChannelService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChannelService);
//# sourceMappingURL=channel.service.js.map