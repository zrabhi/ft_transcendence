import { IsNotEmpty } from "class-validator"

export class blockChannelUserDto{
    @IsNotEmpty()
    userId:string

    @IsNotEmpty()
    channelId:string    
}