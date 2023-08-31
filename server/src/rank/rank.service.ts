import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RankService {
    constructor(private prismaService:PrismaService){}

    async getUsersRank(){
        const rankedUsers = await this.prismaService.user.findMany({
            orderBy:{
                xp:'desc'
            },
            select:{
                username:true,
                xp:true,
            }
        })
        return rankedUsers;
    }
}
