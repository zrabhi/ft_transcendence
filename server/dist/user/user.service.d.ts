import { PrismaService } from '../prisma/prisma.service';
import { Achievement, Match, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateMatchDto } from './dto/create-match.dto';
export declare class UserService {
    private prismaService;
    constructor(prismaService: PrismaService);
    findAllUsers(): Promise<User[]>;
    findUserById(user_id: string): Promise<User>;
    addUser(createUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        username: string;
        password: string;
        avatar: string;
        cover: string;
        status: import(".prisma/client").$Enums.Status;
        country: string;
        win: number;
        loss: number;
        ladder_level: number;
        xp: number;
        totalGames: number;
        discordHandler: string;
        twitterHandler: string;
        created_date: Date;
    }>;
    deleteUserByUsername(user_id: string): Promise<{
        id: string;
    }>;
    achievementById(user_id: string): Promise<Achievement>;
    getMatchesByUserId(user_id: string): Promise<Match[]>;
    createMatch(createMatchDto: CreateMatchDto): Promise<{
        id: number;
    }>;
}
