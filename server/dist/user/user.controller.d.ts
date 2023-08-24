import { UserService } from './user.service';
import { Achievement, Match, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateMatchDto } from './dto/create-match.dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getAllUsers(): Promise<User[]>;
    getUser(user_id: string): Promise<User>;
    createUser(createUserDto: CreateUserDto): Promise<{
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
    deleteUser(user_id: string): Promise<{
        id: string;
    }>;
    getUserAchievement(user_id: string): Promise<Achievement>;
    getMatches(user_id: string): Promise<Match[]>;
    createMatch(createMatchDto: CreateMatchDto): Promise<{
        id: number;
    }>;
}
