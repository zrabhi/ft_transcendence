import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { log } from 'console';
import { UserInfo } from 'src/auth/decorator/user-decorator';

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
  @Get('/users')
  async getAllUsers(@UserInfo() user: User): Promise<User[]> {
    try {
      return await this.userService.findAllUsers(user);
    } catch (err) {}
  }
  @Get('allUsers')
  @UseGuards(JwtAuthGuard)
  async getLeaderBoards(@UserInfo() user: User, @Res() res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      res.status(400).json("error");
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('userNameCheck')
  async handleNickNameCheck(@Req() req, @Res() res) {
    try {
    } catch (err) {}
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  async getUser(@Req() req, @Res() res): Promise<User> {
    try {
      const user = await this.userService.findUserById(req.user.id);
      if (user) return res.status(200).json(user);
      return res.status(400).json({ msg: 'ko' });
    } catch (err) {
      return res.status(400).json({ msg: 'user not found' });
    }
  }
  //   try{
  //     if (!username)
  //       return res.status(400).json({ msg: 'user not found' })
  //     console.log("in user get requets")
  //   const result = await this.userService.findUserName(username);
  //   return res.status(200).json(result);
  //   }catch(err)
  //   {
  //     res.status(400).json("error occured")
  //   }
  // }

  @UseGuards(JwtAuthGuard)
  @Delete('/user')
  async deleteUser(@Req() req) {
    return await this.userService.deleteUserByUsername(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/achievement')
  async getUserAchievement(@Req() req, @Res() res) {
    try {
      const achievements = await this.userService.achievementById(req.user.id);

      res.status(200).json(achievements);
    } catch (err) {
      res.status(400).json('error');
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get('/user/achievement/:username')
  async getUserAchievementByUsername(
    @UserInfo() user: User,
    @Param('username') username: string,
    @Res() res: Response,
  ) {
    try {
      const searchedUser = await this.userService.findUserName(username);
      const achievements = await this.userService.achievementById(
        searchedUser.id,
      );
      res.status(200).json(achievements);
    } catch (err) {
      res.status(400).json('error');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/matches/:username')
  async handleGetUserMatches(
    @UserInfo() user: User,
    @Param('username') username: string,
    @Res() res: Response,
  ) {
    try {
      const searchedUser = await this.userService.findUserName(username);
      const allUserMatches = await this.userService.getMatchesByUserId(
        searchedUser.id,
      );
      const againstMatches = [];
      for (const match of allUserMatches) {
        if (match.loser_id == searchedUser.id) {
          const loser = await this.userService.findUserById(searchedUser.id);
          const winner = await this.userService.findUserById(match.loser_id);
          againstMatches.push({
            winnerScore: match.winner_score,
            loserScore: match.loser_score,
            loser: loser,
            winner: winner,
          });
        } else {
          const loser = await this.userService.findUserById(match.loser_id);
          const winner = await this.userService.findUserById(match.winner_id);
          againstMatches.push({
            winnerScore: match.winner_score,
            loserScore: match.loser_score,
            loser: loser,
            winner: winner,
          });
        }
      }
      res.status(200).json(againstMatches);
    } catch (err) {
      res.status(400).json('error');
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get('/user/matches')
  async getMatches(@Req() req, @Res() res) {
    try {
      const allUserMatches = await this.userService.getMatchesByUserId(
        req.user.id,
      );
      const againstMatches = [];
      for (const match of allUserMatches) {
        if (match.loser_id == req.user.id) {
          const loser = await this.userService.findUserById(req.user.id);
          const winner = await this.userService.findUserById(match.loser_id);
          againstMatches.push({
            winnerScore: match.winner_score,
            loserScore: match.loser_score,
            loser: loser,
            winner: winner,
          });
        } else {
          const loser = await this.userService.findUserById(match.loser_id);
          const winner = await this.userService.findUserById(match.winner_id);
          againstMatches.push({
            winnerScore: match.winner_score,
            loserScore: match.loser_score,
            loser: loser,
            winner: winner,
          });
        }
      }
      res.status(200).json(againstMatches);
    } catch (error) {
      res.status(400).json('error');
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('/users/matches')
  // async createMatch(@Body() createMatchDto: CreateMatchDto) {
  //   try{
  //   return await this.userService.createMatch(createMatchDto);
  //   }catch(err)
  //   {

  //   }
  // }

  @Get('/users/avatar/:user_id')
  async getUserAvatar(@Param('user_id') user_id: string, @Res() res: Response) {
    try {
      const userAvatar = await this.userService.getAvatarById(user_id);
      res.status(200).json(userAvatar);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User Avatar Not Found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/users/cover/:user_id')
  async getUserConver(@Param('user_id') user_id: string, @Res() res: Response) {
    try {
      const userCover = await this.userService.getCoverById(user_id);
      res.status(200).json(userCover);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User Avatar Not Found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @UseGuards(JwtAuthGuard)
  @Put('users/changeUserName')
  async handleUserNameChange(
    @Body() user: PutUserDto,
    @Req() req,
    @Res() Res: Response,
  ) {
    try {
      await this.userService.UpdateUserName(user, req.user.id);
      Res.status(200).json({ msg: 'Updated succefully' });
    } catch (err) {
      Res.status(400).json('ERROR');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/user')
  async handleUpdate(@Body() user: PutUserDto, @Req() req, @Res() response) {
    try {
      await this.userService.updateUser(user, req);
      return response.status(200).json('Information updated successfully');
    } catch (err) {
      return response.status(400).json('Username you chosed already exist');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('users/update')
  async HandleUpdate(@Body() user: PutUserDto, @Res() res, @Req() req) {
    try {
      const User = await this.userService.UpdateAllInfos(user, req.user.id);
      if (User) return res.status(200).json(user);
      res.status(400).json('Please Chose Another Username');
    } catch (err) {
      res.status(400).json('error');
    }
  }

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
      response.status(200).json('error');
    }
    return response.status(200).json(file.path);
  }

  /// this route in my opinion cant be proteted , pictures can be accessed from everywhere
  // @UseGuards(JwtAuthGuard)
  @Get('cover/pictures/:filename')
  async getCover(@Param('filename') filename: string, @Res() res) {
    try {
      res.sendFile(filename, { root: './images/covers' });
    } catch (err) {
      res.status(400).json('avatar not found');
    }
  }

  @Get('avatar/pictures/:filename')
  async getAvatar(@Param('filename') filename: string, @Res() res) {
    try {
      res.sendFile(filename, { root: './images/avatars' });
    } catch (err) {
      res.status(400).json('avatar not found');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('user/checkPassword')
  async handlePasswordCheck(@Res() res, @Req() req, @Body() body) {
    try {
      const checker = await this.userService.passWordCheck(body, req.user.id);
      if (!checker) return res.status(400).json({ msg: 'Incorrect Password' });
      return res.status(200).json({ msg: 'Password Correct' });
    } catch (err) {
      // console.log(err);
    }
  }
  /// --------------------------------------------------Ranking--------------------------------------------------

  @Get('/users/rank/:user_id')
  async getUserRank(@Param('user_id') user_id: string, @Res() res) {
    try {
      const userRank = await this.userService.getUserRankById(user_id);
      return res.json({ user_id, userRank });
    } catch (error) {
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
  async getUsersRank() {
    return await this.userService.getUsersRank();
  }
  /// --------------------------------------------------Logout && disable2fa--------------------------------------------------

  @UseGuards(JwtAuthGuard)
  @Put('/user/disable2fa')
  async handleDisable2fa(@Req() request, @Res() response) {
    await this.userService.disable2fa(request.user.id);
    response
      .status(200)
      .json('Two factor authentication disabled successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Put('/user/logout')
  async handleLogout(@Req() request, @Res() response) {
    try {
      await this.userService.logOut(request.user.id);
      response.status(200).json('ok');
    } catch (err) {}
  }
  @UseGuards(JwtAuthGuard)
  @Get('user/friends')
  async handleGetFriends(@Req() req, @Res() res, @UserInfo() currUser) {
    try {
      const friends = await this.userService.getFriendsByUserId(currUser.id);
      console.log(friends);

      const friendsList = [];
      for (const friend of friends) {
        let user;
        if (friend.friend_id != currUser.id)
          user = await this.userService.findUserById(friend.friend_id);
        if (friend.user_id != currUser.id)
          user = await this.userService.findUserById(friend.user_id);
        friendsList.push(user);
      }
      console.log(friendsList);
      return res.status(200).json(friendsList);
    } catch (err) {
      console.log('error in get friends  ', err);
    }
  }

  @Put('block/:username')
  @UseGuards(JwtAuthGuard)
  async handleBlockUser(
    @Param('username') username: string,
    @UserInfo() user: User,
    @Res() res: Response,
  ) {
    const result = await this.userService.handleBlockUser(user, username);
    if (result.success) res.status(200).json(result);
    else res.status(400).json(result);
  }
  @Put('unblock/:username')
  @UseGuards(JwtAuthGuard)
  async handleUnBlockUser(
    @Param('username') username: string,
    @UserInfo() user: User,
    @Res() res: Response,
  ) {
    const result = await this.userService.handleUnBlockUser(user, username);
    if (result.success) res.status(200).json(result);
    else res.status(400).json(result);
  }
  @Get('blockedUsers')
  @UseGuards(JwtAuthGuard)
  async handleGetBlockedUsers(@UserInfo() user: User, @Res() res: Response) {
    try {
      const result = await this.userService.handleGetBlockedUsers(user);
      res.status(200).json(result);
    } catch (err) {}
  }
  @Get('UsersBlockedMe')
  @UseGuards(JwtAuthGuard)
  async handleGetUsersBlockedMe(@UserInfo() user: User, @Res() res: Response) {
    try {
      const result = await this.userService.handleGetUserblockedMe(user);
      res.status(200).json(result);
    } catch (err) {}
  }

  @UseGuards(JwtAuthGuard)
  @Put('updateStatus')
  async handleUpdateStatus(
    @Res() res: Response,
    @Body() body,
    @UserInfo() user,
  ) {
    try {
      await this.userService.handleUpdateStatus(body.status, user.id);
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(400).json({ success: false });
    }
    /// update user sttaus hereee
  }
  @Get('user/friends/:username')
  async getUserFriendsByName(@Param('username') user_name: string, @Res() res) {
    try {
      const friends = await this.userService.getUserFriendsByName(user_name);
      const friendsList = [];
      for (const friend of friends) {
        const user = await this.userService.findUserById(friend.friend_id);
        friendsList.push({
          username: user.username,
          status: user.status,
          avatar: user.avatar,
        });
      }
      res.status(200).json(friendsList);
    } catch (err) {}
  }
  @Get('getFriendRequests')
  @UseGuards(JwtAuthGuard)
  async handleGetFriendRequests(@UserInfo() user: any, @Res() res: Response) {
    try {
      const result = await this.userService.getFriendRequests(user);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json('Error occuuredd');
    }
  }
  @Put('acceptFriendRequest/:username')
  @UseGuards(JwtAuthGuard)
  async handleAcceptFriendRequest(
    @Param('username') username: string,
    @UserInfo() user: any,
    @Res() res: Response,
  ) {
    try {
      await this.userService.updateFriendRequestState(
        user.id,
        username,
        'ACCEPTED',
      );
      await this.userService.createFriendship(user.id, username);
      res.status(200).json({ success: true, message: 'ACCEPTED' });
    } catch (err) {
      res.status(400).json('error occured');
    }
  }
  @Get('gameRequests')
  @UseGuards(JwtAuthGuard)
  async handleGetGameRequests(@UserInfo() user: any, @Res() res: Response) {
    const result = await this.userService.handleGetGamesReques(user);
    if (result.success) return res.status(200).json(result.games);
    return res.status(400).json(result);
  }
  @Get('requestFriendSent')
  @UseGuards(JwtAuthGuard)
  async handleRequestFriendSent(@UserInfo() user: any, @Res() res: Response) {
    const result = await this.userService.getFriendRequestSent(user);
    if (result.success) return res.status(200).json(result.requests);
    res.status(400).json(result);
  }
  @Put('cancelFriendRequest/:username')
  @UseGuards(JwtAuthGuard)
  async handleCancleFriendRequest(
    @Param('username') username: string,
    @UserInfo() user: any,
    @Res() res: Response,
  ) {
    const result = await this.userService.handleCancleFriendRequest(
      user,
      username,
    );
    if (result.success) return res.status(200).json(result);
    return res.status(400).json(result);
  }
  @Put('unfriend/:username')
  @UseGuards(JwtAuthGuard)
  async handleUnfriendUser(
    @Param('username') username: string,
    @UserInfo() user: any,
    @Res() res: Response,
  ) {
    const result = await this.userService.handleUnFriendUser(user, username);
    if (result.success) return res.status(200).json(result);
    return res.status(400).json(result);
  }

  @Post('friendRequest/:username')
  @UseGuards(JwtAuthGuard)
  async handleFriendRequest(
    @Param('username') username: string,
    @UserInfo() user: any,
    @Res() res: Response,
  ) {
    const result = await this.userService.handleFriendRequest(user, username);
    if (!result.success) return res.status(400).json(result);
    return res.status(200).json(result);
  }
}
