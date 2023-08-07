import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Achievement, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { triggerAsyncId } from 'async_hooks';

@Injectable()
export class UserService {
    constructor(private prismaService:PrismaService) {}

    async findAllUsers():Promise<User[]>{
        return await this.prismaService.user.findMany({});
    }
    
    async findUserById(user_id:string):Promise<User>{
        try
        {
            return await this.prismaService.user.findUnique({
                where:
                {
                    id:user_id,
                },
            })
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: `This User_id:${user_id} is not found.`,
            }, HttpStatus.NOT_FOUND)
        }
    }

    async addUser(createUserDto:CreateUserDto){
        let exist = !!await this.prismaService.user.findFirst({
            where: {
                username: createUserDto.username,
            }
        })
        if (exist)
        {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: `This Username:${createUserDto.username} already used`,
            }, HttpStatus.FORBIDDEN, {
            })
        }
        createUserDto.password = await  bcrypt.hash(createUserDto.password, 10);
        try {
            return await this.prismaService.user.create({
                data:
                {
                    email:createUserDto.email,
                    username:createUserDto.username,
                    password:createUserDto.password,
                    achievement:{
                        create:{
                            accountCreationAchie:true,
                        }
                    }
                },
                select: {
                    id: true,
                }
            });
        } catch(error) {

        }
    }

    async deleteUserByUsername(username:string){
        try {
            return await this.prismaService.user.delete({
                where:{
                    id:username,
                },
                select:{id:true}
            });
        } catch(error) {
            throw new HttpException({
                status: HttpStatus.NO_CONTENT,
                error: `There is no content for ${username}`,
            }, HttpStatus.NO_CONTENT, {
            })
        }
    }

    async achievementById(user_id:string):Promise<Achievement>{
        try {
            return await this.prismaService.achievement.findUnique({
                where:{
                    userId: user_id,
                }
            })
        } catch(error) {

        }
    }
}
