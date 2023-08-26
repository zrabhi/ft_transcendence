import { IsNotEmpty, IsString } from "class-validator"

export class createMessageDto{
    @IsNotEmpty()
    @IsString()
    senderId:string

    @IsNotEmpty()
    @IsString()
    recieverId:string

    @IsNotEmpty()
    @IsString()
    content:string
}