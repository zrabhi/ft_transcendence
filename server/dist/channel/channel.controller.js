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
let ChannelController = exports.ChannelController = class ChannelController {
    constructor(channelService) {
        this.channelService = channelService;
    }
    async createChannel(createChannelDto) {
        return await this.channelService.addChannel(createChannelDto);
    }
    async deleteChannel(channelId, res) {
        return await this.channelService.deleteChannelById(channelId, res);
    }
    async leaveChannel(user_id, channelId) {
        return await this.channelService.removeUserfromChannel(user_id, channelId);
    }
    async membersOfChannels(channelId) {
        return await this.channelService.getMembersOfChannel(channelId);
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
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "deleteChannel", null);
__decorate([
    (0, common_1.Delete)('/:channelId/:user_id'),
    __param(0, (0, common_1.Param)('user_id')),
    __param(1, (0, common_1.Param)('channelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "leaveChannel", null);
__decorate([
    (0, common_1.Get)('/:channelId/members'),
    __param(0, (0, common_1.Param)('channelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "membersOfChannels", null);
exports.ChannelController = ChannelController = __decorate([
    (0, common_1.Controller)('api/channels'),
    __metadata("design:paramtypes", [channel_service_1.ChannelService])
], ChannelController);
//# sourceMappingURL=channel.controller.js.map