import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Achievement, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('/api/users')
export class UserController {
    constructor(private userService:UserService) {}

    @Get('/')
    async getAllUsers():Promise<User[]>{
        return await this.userService.findAllUsers();
    }
    
    @Get('/:user_id')
    async getUser(@Param('user_id') user_id:string):Promise<User>{
        return await this.userService.findUserById(user_id);
    }

    @Post('/')
    async createUser(@Body() createUserDto:CreateUserDto){
        return await this.userService.addUser(createUserDto);
    }

    @Delete('/:username')
    async deleteUser(@Param('username') username:string){
        return await this.userService.deleteUserByUsername(username);
    }

    @Get('/:user_id/achievement')
    async getUserAchievement(@Param('user_id') user_id:string):Promise<Achievement>{
        return await this.userService.achievementById(user_id);
    }
}
