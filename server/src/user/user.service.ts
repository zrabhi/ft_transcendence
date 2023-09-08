/* eslint-disable prettier/prettier */
import { Body, HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Achievement, Match, Prisma, State, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateMatchDto } from './dto/create-match.dto';
import { FileUserDto, PutUserDto } from './dto/put-user-dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findAllUsers(): Promise<User[]> {
    return await this.prismaService.user.findMany({});
  }

  async findUserById(user_id: string): Promise<User> {
    return await this.prismaService.user.findUniqueOrThrow({
      where: {
        id: user_id,
      },
    });
  }

  // async checkUserNames(user: PutUserDto, userId: string)
  // {
    


  // }

  async addUser(createUserDto: CreateUserDto) {
    const exist = !!(await this.prismaService.user.findFirst({
      where: {
        OR: [
          { username: createUserDto.username },
          { email: createUserDto.email },
        ],
      },
    }));
    if (exist) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: `This Username or email already used`,
        },
        HttpStatus.FORBIDDEN,
        {},
      );
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    try {
      return await this.prismaService.user.create({
        data: {
          email: createUserDto.email,
          username: createUserDto.username,
          password: createUserDto.password,
          achievement: {
            create: {
              accountCreationAchie: true,
            },
          },
        },
        select: {
          id: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteUserByUsername(user_id: string) {
    try {
      return await this.prismaService.user.delete({
        where: {
          id: user_id,
        },
        select: { id: true },
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NO_CONTENT,
          error: `There is no content for ${user_id}`,
        },
        HttpStatus.NO_CONTENT,
        {},
      );
    }
  }

   /// find user witth unique username
  async findUserName(username: string): Promise<User> {
    try {
      return await this.prismaService.user.findUniqueOrThrow({
        where: {
          username: username,
        },
      });
    } catch (error) {
      // throw new HttpException(
      //   {
      //     status: HttpStatus.NOT_FOUND,
      //     error: `This username :${username} is not found.`,
      //   },
      //   HttpStatus.NOT_FOUND,
      // );
  }

  }


  /// find user witth unique email
  async findUserEmail(email: string) : Promise<User>
  {
    try {
      return await this.prismaService.user.findUniqueOrThrow({
        where: {
          email: email,
        },
      });
    } catch (error) {
      // throw new HttpException(
      //   {
      //     status: HttpStatus.NOT_FOUND,
      //     error: `This username :${username} is not found.`,
      //   },
      //   HttpStatus.NOT_FOUND,
      // );
    }
  }

  async achievementById(userId: string): Promise<Achievement> {
    try {
      console.log("in start fucntion");
      
      return await this.prismaService.achievement.findUnique({
        where: {
          userId: userId,
        },
      });
    } catch (error) {
      
      
    }
  }

  async getMatchesByUserId(user_id:string): Promise<Match[]> {
      return await this.prismaService.match.findMany({
        where: {
          OR: [{ winner_id: user_id }, { loser_id: user_id }],
        },
        orderBy: {
          played_at: 'desc',
        },
      });

  }

  async createMatch(createMatchDto: CreateMatchDto) {
      await this.prismaService.user.update({
        where: { id: createMatchDto.winner_id },
        data: {
          win: { increment: 1 },
          totalGames: { increment: 1 },
        },
      });
      await this.prismaService.user.update({
        where: { id: createMatchDto.loser_id },
        data: {
          loss: { increment: 1 },
          totalGames: { increment: 1 },
        },
      });
      return await this.prismaService.match.create({
        data: {
          winner_id: createMatchDto.winner_id,
          loser_id: createMatchDto.loser_id,
          winner_score: createMatchDto.winner_score,
          loser_score: createMatchDto.loser_score,
        },
        select: {
          id: true,
        },
      });
  }

  async updateUser(body, req) {
      const hashedPass = await bcrypt.hash(body.password, 10);
      return await this.prismaService.user.update({
        where: { id: req.user.id },
        data: {
          password: hashedPass,
          username: body.username,
        },
      });
   
  }
  async updateAvatarorCover(
    infos: FileUserDto,
    userId: string,
    toBeUpdated: string,
  ) {
    if (toBeUpdated === 'avatar') {
      try {
        return await this.prismaService.user.update({
          where: { id: userId },
          data: {
            avatar: `http://127.0.0.1:8080/api/avatar/pictures/${infos.avatar}`,
          },
        });
      } catch (err) {
        // console.log(err);
      }
      {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `Avatar image  error occured`,
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } else if (toBeUpdated === 'cover') {
      try {
        return await this.prismaService.user.update({
          where: { id: userId },
          data: {
            cover: `http://127.0.0.1:8080/api/cover/pictures/${infos.cover}`,
          },
        });
      } catch (err) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `Cover image  error occured`,
          },
          HttpStatus.NOT_FOUND,
        );
      }
    }
  }

  async UpdateUserName(user: PutUserDto, UserId: string) {
    try {
      return await this.prismaService.user.update({
        where: { id: UserId },
        data: {
          username: user.username,
        },
      });
    } catch (err) {
      // console.log(err);
    }
  }

  async UpdateAllInfos(user: PutUserDto, userId: string) {
    let hashedPass = null;
    if (user.password) hashedPass = await bcrypt.hash(user.password, 10);
    try {
      if (user.username && user.password) {
        // console.log('In both!!!!');

        return await this.prismaService.user.update({
          where: { id: userId },
          data: {
            username: user.username,
            password: hashedPass,
          },
        });
      } else if (user.username) {
        // console.log('UserName');
        return await this.prismaService.user.update({
          where: { id: userId },
          data: {
            username: user.username,
          },
        });
      } else if (user.password) {
        // console.log('only password');
        return await this.prismaService.user.update({
          where: { id: userId },
          data: {
            password: hashedPass,
          },
        });
      }
    } catch (err) {
      // console.log(err);
    }
  }
  async passWordCheck(@Body() Body, userId: string) {
    try {

      const user = await this.findUserById(userId);
      return await bcrypt.compare(Body.password, user.password);

    } catch (err) {
        // console.log(err);
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `This User_id:${userId} is not found.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
  
  async getAllUserRank() {
    const rankedUser = await this.prismaService.user.findMany({
      orderBy:{
        xp:'desc',
      },
      select:{
        id:true,
        username:true,
        xp:true,
      }
    })
    return rankedUser;
  }

  async getUserRankById(user_id:string) {
      const user = await this.prismaService.user.findFirstOrThrow({
        where:{
          id:user_id,
        }
      })
      const rankedUsers = await this.getAllUserRank();
      let index = rankedUsers.findIndex((usr) => usr.id === user_id);
      if (index === 0)
        return 1;
      return index;
  }

  async getUsersRank(){
    const rankedUsers = await this.getAllUserRank();
    const Users = [];
    let index = 0;

    for (let user of rankedUsers){
      user['index'] = index++; 
      Users.push(user);
    }
    return Users;
  }
  
  async getAvatarById(user_id:string){
    return await this.prismaService.user.findFirstOrThrow({
      where:{
        id:user_id,
      },
      select:{
        id:true,
        avatar: true,
      }
    })
  }

  async getCoverById(user_id:string){
    return await this.prismaService.user.findFirstOrThrow({
      where:{
        id:user_id,
      },
      select:{
        id:true,
        cover:true,
      }
    })
  }

  async createFriendship(user_one_id:string, user_two_id:string){
      const userOne = await this.findUserById(user_one_id);
      const userTwo = await this.findUserById(user_two_id);

      const isFriend = await this.prismaService.friendship.findFirst({
        where:{
          OR:[{user_id:userOne.id, friend_id:userTwo.id},
            {user_id:userTwo.id, friend_id:userOne.id}],
        }
      })
      if (isFriend)
        return ;
      await this.prismaService.friendship.create({
        data:{
          user_id: userOne.id,
          friend_id: userTwo.id,
        }
      })
  }
  
  async deleteFriendship(user_one:string, user_two:string){
    const userOne = await this.findUserById(user_one);
    const userTwo = await this.findUserById(user_two);
  
    const friendshipId = await this.prismaService.friendship.findFirstOrThrow({
      where:{
        OR:[{user_id:user_one, friend_id:user_two},
            {user_id:user_two, friend_id:user_one}],
      },
    });
    await this.prismaService.friendship.delete({
      where:{
        id:friendshipId.id,
      }
    })
  }

  async getFriendsByUserId(user_id:string){
    return await this.prismaService.friendship.findMany({
      where:{
        user_id:user_id,
      }
    })
  }
  
  async updateFriendRequestState(user_one_id:string, user_two_id:string, state:State){
    const userOne = await this.findUserById(user_one_id);
    const userTwo = await this.findUserById(user_two_id);
    
    const FriendRequestId = await this.prismaService.friendRequest.findFirstOrThrow({
      where:{
        requester_id: userOne.id,
        requested_id: userTwo.id,
      },
    })

    return await this.prismaService.friendRequest.update({
      where:{
        id:FriendRequestId.id,
      },
      data:{
        updated_at: new Date(),
        state: state,
      },
    })
  }


  async blockUser(user_blocker_id:string, user_blocked_id:string)
  {
    const blocker = await this.findUserById(user_blocker_id);
    const blocked = await this.findUserById(user_blocked_id);

    await this.prismaService.userBlock.create({
      data:{
        blockerId:blocker.id,
        blockedId:blocked.id,
      }
    });
  }

  async unblockUser(blockerId:string, blockedId:string){
    const blocked = await this.findUserById(blockedId);
    const blocker = await this.findUserById(blockerId)
  
    const blockRelaId = await this.prismaService.userBlock.findFirstOrThrow({
      where:{
        blockerId:blocker.id,
        blockedId:blocked.id,
      }
    })
    await this.prismaService.userBlock.delete({
      where:{
        id:blockRelaId.id,
      },
    })
  }

  async searchUserStartWithPrefix(usernamePrefix:string){
    return await this.prismaService.user.findMany({
      where:{
        username:{
          startsWith:usernamePrefix,
        }
      },
    })
  }


  // async getFileUpload(fileTarget, category) {
  //   let userFile: any = undefined;
  //   const assets = await readdir(`./images/${category}`);
  //   // loop over the files in './uploads' and set the userFile var to the needed file
  //   for (const file of assets) {
  //     const {base} = parse(file)
  //     if (base === fileTarget) {
  //       userFile = file;
  //       break;
  //     }
  //   }
  //   if (userFile) {
  //     console.log("file found");
  //     return true
  //   }
  //   else
  //   {
  //     console.log("file not found");
  //     return false
  //   }
  // }
}
