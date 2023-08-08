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
