import { HttpException, HttpStatus, Injectable, Param, StreamableFile } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Achievement, Match, Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateMatchDto } from './dto/create-match.dto';
import { FileUserDto } from './dto/put-user-dto';
import { readdir } from 'fs/promises';
import { parse } from 'path';
import { createReadStream } from 'fs';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findAllUsers(): Promise<User[]> {
    return await this.prismaService.user.findMany({});
  }

  async findUserById(user_id: string): Promise<User> {
    try {
      return await this.prismaService.user.findUniqueOrThrow({
        where: {
          id: user_id,
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `This User_id:${user_id} is not found.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async addUser(createUserDto: CreateUserDto) {
    let exist = !!(await this.prismaService.user.findFirst({
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

  async findUserName(username: string):  Promise<User> 
  {
    try {
        return await this.prismaService.user.findUniqueOrThrow({
          where: {
            username: username,
          },
        });
      } catch (error) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `This username :${username} is not found.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

  }
  async achievementById(username: string): Promise<Achievement> {
    try {
        const user = await this.findUserName(username)
        return await this.prismaService.achievement.findUnique({
        where: {
          id: user.id,
        },
      });
    } catch (error) {}
  }

  async getMatchesByUserId(
    @Param('user_id') user_id: string,
  ): Promise<Match[]> {
    try {
      return await this.prismaService.match.findMany({
        where: {
          OR: [{ winner_id: user_id }, { loser_id: user_id }],
        },
        orderBy: {
          played_at: 'desc',
        },
      });
    } catch (error) {
    }
  }

  async createMatch(createMatchDto: CreateMatchDto) {
    try {
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
    } catch (error) {}
  }

  async updateUser(body, req) {
    try {
      const hashedPass = await bcrypt.hash(body.password, 10);
      return await this.prismaService.user.update({
        where: { id: req.user.id },
        data: {
          password: hashedPass,
          username: body.username,
        },
      });
    } catch (error) {
    }
  }

    async updateAvatarorCover(infos : FileUserDto, userId: string, toBeUpdated: string)
    {
        if (toBeUpdated === 'avatar')
        {
          try {
            return await this.prismaService.user.update({
              where: { id: userId },
              data: {
                  avatar:`http://127.0.0.1:8080/api/avatar/pictures/${infos.avatar}`,
              },
            });
        }catch(err)
        {
          throw new HttpException(
            {
              status: HttpStatus.NOT_FOUND,
              error: `Avatar image  error occured`,
            },
            HttpStatus.NOT_FOUND,
          );
        }
      }

      else if (toBeUpdated === 'cover')
      {
        try {
          return await this.prismaService.user.update({
            where: { id: userId },
            data: {
                cover: `http://127.0.0.1:8080/api/cover/pictures/${infos.cover}`,
            },
          });
      }catch(err)
      {
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
async getFileUpload(fileTarget, category)
{
	
			const file = createReadStream(`./images/${category}/${fileTarget}`);
			return new StreamableFile(file);
		
  // async updateUser(updateUserDto: UpdateUserDto){
  //     try {
  //         if (updateUserDto.username !== undefined)
  //         {
  //             if (!!await this.prismaService.user.findFirst({
  //                 where:{
  //                     username:updateUserDto.username,
  //                 }
  //             }))
  //             {
  //                 throw new HttpException({
  //                     status: HttpStatus.BAD_REQUEST,
  //                     error: `These ${updateUserDto.username} already used try another one`,
  //                 }, HttpStatus.BAD_REQUEST, {
  //                 })
  //             }
  //         }
  //         if (updateUserDto.Oldpassword !== undefined && updateUserDto.Newpassword && updateUserDto.Confirmedpassword)
  //         {
  //             if (updateUserDto.)
  //         }
  //     } catch(error) {

  //     }
  // }
}
}