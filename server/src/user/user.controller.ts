import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Achievement, Match, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateMatchDto } from './dto/create-match.dto';
import { JwtAuthGuard } from 'src/auth/Guards/AuthGurad';

@Controller('/api')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/users/')
    async getAllUsers():Promise<User[]>{
        return await this.userService.findAllUsers();
    }

    @UseGuards(JwtAuthGuard)
    @Get('/users/:user_id')
    async getUser(@Param('user_id') user_id:string):Promise<User>{
        return await this.userService.findUserById(user_id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/users/')
    async createUser(@Body() createUserDto:CreateUserDto){
        return await this.userService.addUser(createUserDto);
    }
    @UseGuards(JwtAuthGuard)
    @Delete('/users/:user_id')
    async deleteUser(@Param('user_id') user_id:string){
        return await this.userService.deleteUserByUsername(user_id);
    }
    @UseGuards(JwtAuthGuard)
    @Get('/users/:user_id/achievement')
    async getUserAchievement(@Param('user_id') user_id:string):Promise<Achievement>{
        return await this.userService.achievementById(user_id);
    }
    @UseGuards(JwtAuthGuard)
    @Get('/users/:user_id/matches')
    async getMatches(@Param('user_id') user_id:string):Promise<Match[]>{
        return await this.userService.getMatchesByUserId(user_id);
    }
    @UseGuards(JwtAuthGuard)
    @Post('/users/matches')
    async createMatch(@Body() createMatchDto:CreateMatchDto){
        return await this.userService.createMatch(createMatchDto);
    }
    @UseGuards(JwtAuthGuard)
    @Put('/users')
    async handleUpdate(@Body() user, @Req() req, @Res() response)
    {
        console.log("body is ", user); 
        try{
           await this.userService.updateUser(user, req);      
            return  response.status(200).json({msg: "Information updated successfully"})
        }catch(err){
            console.log("im here nowwwww");
            
            response.status(400).json({msg: "Couldn't update Your information"});
        }
         
        // return response.redirect('http://127.0.0.1:3000');  
    }
}
