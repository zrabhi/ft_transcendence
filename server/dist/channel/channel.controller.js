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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelController = void 0;
const common_1 = require("@nestjs/common");
const channel_service_1 = require("./channel.service");
const create_channel_dto_1 = require("./dto/create-channel.dto");
const create_UserRole_dto_1 = require("./dto/create-UserRole.dto");
const create_Message_channel_dto_1 = require("./dto/create-Message-channel.dto");
let ChannelController = exports.ChannelController = class ChannelController {
    constructor(channelService) {
        this.channelService = channelService;
    }
    async createChannel(createChannelDto) {
        return await this.channelService.addChannel(createChannelDto);
    }
    async deleteChannel(channelId) {
        return await this.channelService.deleteChannelById(channelId);
    }
    async getChannelMembers(channelId) {
        return await this.channelService.getAllChannelMembers(channelId);
    }
    async addUserToChannel(createUserRole) {
        return await this.channelService.addUserChannel(createUserRole);
    }
    async kickUser() {
    }
    async addMessage(createMsgChanDto) {
        return await this.channelService.createMessage(createMsgChanDto);
    }
    async getChannelMessages() {
        return await this.channelService.getAllChannelMessage();
    }
    async getChannel(channelId) {
        return await this.channelService.getChannelById(channelId);
    }
    async MsgOfChannel(channelId) {
        return await this.channelService.getMessagesByChannelId(channelId);
    }
};
__decorate([
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_channel_dto_1.CreateChannelDto]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "createChannel", null);
__decorate([
    (0, common_1.Delete)('/:channelId'),
    __param(0, (0, common_1.Param)('channelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "deleteChannel", null);
__decorate([
    (0, common_1.Get)('/:channelId/members'),
    __param(0, (0, common_1.Param)('channelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "getChannelMembers", null);
__decorate([
    (0, common_1.Post)('/members'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_UserRole_dto_1.createUserRoleDto]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "addUserToChannel", null);
__decorate([
    (0, common_1.Delete)('/kick'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "kickUser", null);
__decorate([
    (0, common_1.Post)('/messages'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_Message_channel_dto_1.createMessageChannelDto]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "addMessage", null);
__decorate([
    (0, common_1.Get)('/messages'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "getChannelMessages", null);
__decorate([
    (0, common_1.Get)('/:channelId'),
    __param(0, (0, common_1.Param)('channelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "getChannel", null);
__decorate([
    (0, common_1.Get)('/:channelId/messages'),
    __param(0, (0, common_1.Param)('channelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "MsgOfChannel", null);
exports.ChannelController = ChannelController = __decorate([
    (0, common_1.Controller)('api/channels'),
    __metadata("design:paramtypes", [channel_service_1.ChannelService])
], ChannelController);
//# sourceMappingURL=channel.controller.js.map