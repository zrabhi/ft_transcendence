import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Achievement, Match, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateMatchDto } from './dto/create-match.dto';
import { JwtAuthGuard } from 'src/auth/Guards/AuthGurad';
import { PutUserDto } from './dto/put-user-dto';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('/api')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/users/')
  async getAllUsers(): Promise<User[]> {
    return await this.userService.findAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/')
  async getUser(@Req() req): Promise<User> {
    return await this.userService.findUserById(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:username')
  async getUseByName(@Param('username') username: string): Promise<User> {
    return await this.userService.findUserName(username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/users/')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.addUser(createUserDto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('/user')
  async deleteUser(@Req() req) {
    return await this.userService.deleteUserByUsername(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/users/:username/achievement')
  async getUserAchievement(
    @Param('username') username: string,
  ): Promise<Achievement> {
    return await this.userService.achievementById(username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/users/matches')
  async getMatches(@Param('user_id') user_id: string): Promise<Match[]> {
    return await this.userService.getMatchesByUserId(user_id);
  }
  @UseGuards(JwtAuthGuard)
  @Post('/users/matches')
  async createMatch(@Body() createMatchDto: CreateMatchDto) {
    return await this.userService.createMatch(createMatchDto);
  }
  @UseGuards(JwtAuthGuard)
  @Put('/users')
  async handleUpdate(@Body() user: PutUserDto, @Req() req, @Res() response) {
    try {
      await this.userService.updateUser(user, req);
      return response
        .status(200)
        .json({ msg: 'Information updated successfully' });
    } catch (err) {
      response.status(400).json({ msg: "Couldn't update Your information" });
    }
  }
  @UseGuards(JwtAuthGuard)
  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './images/avatars',
        filename: (req, file, cb) => {
          console.log(file);

          cb(null, file.originalname);
        },
      }),
    }),
  )
  async uploadAvatart(
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
    @Body() body,
  ) {
    console.log('BODY ', body);

    return response.status(200).json(file.path);
  }
  @Post('cover')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './images/covers',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async uploadCover(
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
    @Body() body,
  ) {
    console.log(body);

    return response.status(200).json(file.path);
  }
}
