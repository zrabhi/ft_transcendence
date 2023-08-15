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
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const message_service_1 = require("./message.service");
const create_message_dto_1 = require("./dto/create-message.dto");
let MessageController = exports.MessageController = class MessageController {
    constructor(messageService) {
        this.messageService = messageService;
    }
    async createMessage(createMessageDto) {
        return await this.messageService.addMessage(createMessageDto);
    }
    async getMessages() {
        return await this.messageService.getAllMessage();
    }
    async getMessageByUserId(userId) {
        return await this.messageService.getMessageById(userId);
    }
};
__decorate([
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.createMessageDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "createMessage", null);
__decorate([
    (0, common_1.Get)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Get)('/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getMessageByUserId", null);
exports.MessageController = MessageController = __decorate([
    (0, common_1.Controller)('/api/messages/'),
    __metadata("design:paramtypes", [message_service_1.MessageService])
], MessageController);
//# sourceMappingURL=message.controller.js.map