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
                messages: {},
                restrictedUsers: {}
            },
            select: { id: true }
        });
    }
    async deleteChannelById(channelId) {
        try {
            return await this.prismaService.channel.delete({
                where: {
                    id: channelId,
                },
                select: { id: true }
            });
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NO_CONTENT,
                error: `There is no content for this channel Id`,
            }, common_1.HttpStatus.NO_CONTENT, {});
        }
    }
    async getAllChannelMembers(channelId) {
        return await this.prismaService.userRole.findMany({
            where: {
                channelId: channelId,
            },
            select: { userId: true }
        });
    }
    async addUserChannel(createUserRole) {
        let exist = !!await this.prismaService.userRole.findFirst({
            where: {
                userId: createUserRole.userId,
                channelId: createUserRole.channelId,
            }
        });
        if (exist) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.FORBIDDEN,
                error: `This user is already registred in the channel`,
            }, common_1.HttpStatus.FORBIDDEN);
        }
        return await this.prismaService.userRole.create({
            data: {
                userId: createUserRole.userId,
                channelId: createUserRole.channelId,
                role: createUserRole.role
            },
            select: {
                id: true
            }
        });
    }
    async getChannelById(channelId) {
        return await this.prismaService.channel.findFirst({
            where: {
                id: channelId,
            }
        });
    }
    async createMessage(createMsgChanDto) {
        return await this.prismaService.channel_message.create({
            data: {
                user_id: createMsgChanDto.user_id,
                channel_id: createMsgChanDto.channel_id,
                content: createMsgChanDto.content,
            }
        });
    }
    async getAllChannelMessage() {
        return await this.prismaService.channel_message.findMany({});
    }
    async getMessagesByChannelId(channelId) {
        return await this.prismaService.channel_message.findMany({
            where: {
                channel_id: channelId,
            },
            orderBy: {
                created_at: 'desc',
            }
        });
    }
};
exports.ChannelService = ChannelService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChannelService);
//# sourceMappingURL=channel.service.js.map