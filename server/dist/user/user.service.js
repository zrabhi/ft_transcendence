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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
let UserService = exports.UserService = class UserService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async findAllUsers() {
        return await this.prismaService.user.findMany({});
    }
    async findUserById(user_id) {
        try {
            return await this.prismaService.user.findUnique({
                where: {
                    id: user_id,
                },
            });
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                error: `This User_id:${user_id} is not found.`,
            }, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async addUser(createUserDto) {
        let exist = !!await this.prismaService.user.findFirst({
            where: {
                username: createUserDto.username,
            }
        });
        if (exist) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.FORBIDDEN,
                error: `This Username:${createUserDto.username} already used`,
            }, common_1.HttpStatus.FORBIDDEN, {});
        }
        createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
        try {
            return await this.prismaService.user.create({
                data: {
                    email: createUserDto.email,
                    username: createUserDto.username,
                    password: createUserDto.password,
                    achievement: {
                        create: {
                            accountCreationAchie: true,
                        }
                    }
                },
                select: {
                    id: true,
                }
            });
        }
        catch (error) {
        }
    }
    async deleteUserByUsername(username) {
        try {
            return await this.prismaService.user.delete({
                where: {
                    id: username,
                },
                select: { id: true }
            });
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NO_CONTENT,
                error: `There is no content for ${username}`,
            }, common_1.HttpStatus.NO_CONTENT, {});
        }
    }
    async achievementById(user_id) {
        try {
            return await this.prismaService.achievement.findUnique({
                where: {
                    userId: user_id,
                }
            });
        }
        catch (error) {
        }
    }
    async getMatchesByUserId(user_id) {
        try {
            return await this.prismaService.match.findMany({
                where: {
                    OR: [
                        { winner_id: user_id },
                        { loser_id: user_id }
                    ]
                },
                orderBy: {
                    played_at: 'asc'
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    async createMatch(createMatchDto) {
        try {
            await this.prismaService.user.update({
                where: { id: createMatchDto.winner_id },
                data: {
                    win: { increment: 1 },
                    totalGames: { increment: 1 },
                }
            });
            await this.prismaService.user.update({
                where: { id: createMatchDto.loser_id },
                data: {
                    loss: { increment: 1 },
                    totalGames: { increment: 1 },
                }
            });
            console.log("crazy");
            return await this.prismaService.match.create({
                data: {
                    winner_id: createMatchDto.winner_id,
                    loser_id: createMatchDto.loser_id,
                    winner_score: createMatchDto.winner_score,
                    loser_score: createMatchDto.loser_score,
                },
                select: {
                    id: true,
                }
            });
        }
        catch (error) {
        }
    }
};
__decorate([
    __param(0, (0, common_1.Param)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "getMatchesByUserId", null);
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map