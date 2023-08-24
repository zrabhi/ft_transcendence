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
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MessageService = exports.MessageService = class MessageService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async addMessage(createMessageDto) {
        return await this.prismaService.message.create({
            data: {
                sender_id: createMessageDto.senderId,
                reciever_id: createMessageDto.recieverId,
                content: createMessageDto.content
            },
            select: { id: true }
        });
    }
    async getMessageById(userId) {
        return await this.prismaService.message.findMany({
            where: {
                OR: [
                    { sender_id: userId },
                    { reciever_id: userId }
                ]
            },
            orderBy: {
                created_at: 'desc'
            }
        });
    }
    async getAllMessage() {
        return await this.prismaService.message.findMany({});
    }
};
exports.MessageService = MessageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessageService);
//# sourceMappingURL=message.service.js.map