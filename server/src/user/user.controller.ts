import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Achievement, Match, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateMatchDto } from './dto/create-match.dto';

@Controller('/api')
export class UserController {
    constructor(private userService:UserService) {}

    @Get('/users/')
    async getAllUsers():Promise<User[]>{
        return await this.userService.findAllUsers();
    }
    
    @Get('/users/:user_id')
    async getUser(@Param('user_id') user_id:string):Promise<User>{
        return await this.userService.findUserById(user_id);
    }

    @Post('/users/')
    async createUser(@Body() createUserDto:CreateUserDto){
        return await this.userService.addUser(createUserDto);
    }

    @Delete('/users/:username')
    async deleteUser(@Param('username') username:string){
        return await this.userService.deleteUserByUsername(username);
    }

    @Get('/users/:user_id/achievement')
    async getUserAchievement(@Param('user_id') user_id:string):Promise<Achievement>{
        return await this.userService.achievementById(user_id);
    }

    @Get('/users/:user_id/matches')
    async getMatches(@Param('user_id') user_id:string):Promise<Match[]>{
        return await this.userService.getMatchesByUserId(user_id);
    }
    
    @Post('/users/matches')
    async createMatch(@Body() createMatchDto:CreateMatchDto){
        return await this.userService.createMatch(createMatchDto);
    }
}
