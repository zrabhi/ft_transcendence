import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { createChannelDto } from "./dto/chat.dto";


@Injectable()
export class ChatRepository {
    constructor(private databaseService: PrismaService) { }
    
    async deleteChannel() {

    }

    async createChannel() {

    }

    async deleteUserChannel() {

    }

    async getChannelMembers() {

    }

    async getBannedUsers() {

    }

    async udpateUserRole() {

    }
}