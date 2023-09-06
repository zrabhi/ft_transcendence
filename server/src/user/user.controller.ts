import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Achievement, Match, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateMatchDto } from './dto/create-match.dto';
import { JwtAuthGuard } from 'src/auth/Guards/AuthGurad';
import { PutUserDto } from './dto/put-user-dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { UserService } from './user.service';

export const strorageCover = {
  storage: diskStorage({
    destination: './images/covers',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) return cb(null, false);
    cb(null, true);
  },
};

export const strorageAvatar = {
  storage: diskStorage({
    destination: './images/avatars',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      // console.log(file);

      cb(null, `${filename}${extension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) return cb(null, false);
    cb(null, true);
  },
};

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
  async getUser(@Req() req, @Res() res): Promise<User> {
    console.log("im hereee");
    const user  = await this.userService.findUserById(req.user.id);
    if (user)
        return res.status(200).json(user);
    return res.status(400).json({msg:"ko"})
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
  @Put('users/changeUserName')
  async handleUserNameChange(@Body() user: PutUserDto, @Req() req, @Res() Res)
  {
   
    try {
        await this.userService.UpdateUserName(user, req.user.id)
        Res.status(200).json({msg: "Updated succefully"}) ;
      }catch(err)
    {
        console.log(err);
        
    }
  }
  @UseGuards(JwtAuthGuard)
  @Put('users/update')
  async HandleUpdate(@Body() user: PutUserDto, @Res() res, @Req() req)
  { 
    console.log(user);
    const User =   await this.userService.UpdateAllInfos(user, req.user.id);
    console.log(User);
    return user;
    
    // res.status(200).json({msg:"Ok"});
  }
  // avatar imagesss
          

  @UseGuards(JwtAuthGuard)
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file', strorageAvatar))
  async uploadAvatart(
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
    @Req() req,
  ) {
    if (!file) return response.status(400).json({ msg: 'File is not Image' });
    try {
      this.userService.updateAvatarorCover(
        { avatar: file.filename, cover: '' },
        req.user.id,
        'avatar',
      );
      return response.status(200).json(file);
    } catch (err) {
      response.status(400).json({ message: err.message });
      // console.log('image rro', err.message);

      throw new err();
    }
  }

  //cover imagess
  @UseGuards(JwtAuthGuard)
  @Post('cover')
  @UseInterceptors(FileInterceptor('file', strorageCover))
  async uploadCover(
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
    @Req() req,
  ) {
    if (!file) return response.status(400).json({ msg: 'File is not Image' });
    try {
      this.userService.updateAvatarorCover(
        { avatar: '', cover: file.filename },
        req.user.id,
        'cover',
      );
      return response.status(200).json(file);
    } catch (err) {
      // console.log('image rro', err.message);
      throw new err();
    }
    return response.status(200).json(file.path);
  }
  /// this route in my opinion cant be proteted , pictures can be accessed from everywhere
  // @UseGuards(JwtAuthGuard)
  @Get('cover/pictures/:filename')
  async getCover(@Param('filename') filename: string, @Res() res) {
    // if (await this.userService.getFileUpload(filename, 'covers'))
    //   res.sendFile(filename, { root: './images/covers' });
    res.sendFile(filename, { root: './images/covers' });
  }
  @Get('avatar/pictures/:filename')
  async getAvatar(@Param('filename') filename: string, @Res() res) {
    // if (await this.userService.getFileUpload(filename, 'avatars'))
    //   res.sendFile(filename, { root: './images/avatars' });
    res.sendFile(filename, { root: './images/avatars' });
  }

  /// --------------------------------------------------Ranking--------------------------------------------------

  @Get('/users/rank/:user_id')
  async getUserRank(@Param('user_id') user_id:string, @Res() res){
    try{
      const userRank = await this.userService.getUserRankById(user_id);
      return res.json({user_id, userRank});
    }
    catch(error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `UserNotFound`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
  
  @Get('/users/rank/')
  async getUsersRank(){
    return await this.userService.getUsersRank();
  }
  
  /// --------------------------------------------------

  // searching route
  // get country route
  // 
  // To-Do //
  // GET /api/users/friends/:user_id
  // GET /api/users/friendRequest/outgoing/:user_id
  // GET /api/users/friendRequest/incoming/:user_id
  // 
}