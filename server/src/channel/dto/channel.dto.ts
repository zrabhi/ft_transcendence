import { Role, Type } from "@prisma/client"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateChannelDto{
    @IsString()
    @IsNotEmpty()
    name:string

    @IsNotEmpty()
    type:Type

    @IsNotEmpty()
    @IsOptional()
    password:string

    @IsNotEmpty()
    @IsString()
    owner_id:string
}

export class createMessageChannelDto{
    @IsNotEmpty()
    channel_id:string
    
    @IsNotEmpty()
    user_id:string
    
    @IsNotEmpty()
    content:string
}

export class createUserRoleDto{
    @IsNotEmpty()
    @IsString()
    userId:string
    
    @IsNotEmpty()
    @IsString()
    channelId:string

    @IsNotEmpty()
    role:Role
}

export class deleteUserChannelDto{
    @IsNotEmpty()
    user_id:string

    @IsNotEmpty()
    channel_id:string
}

export class updateUserRoleDto{
    @IsNotEmpty()
    owner_id:string

    @IsNotEmpty()
    user_id:string

    @IsNotEmpty()
    role:Role
}

export class userBanMuteDto{
    @IsNotEmpty()
    baner_id:string

    @IsNotEmpty()
    banned_id:string

    @IsNotEmpty()
    channel_id:string
}