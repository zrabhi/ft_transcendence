import { IsNotEmpty } from "class-validator"

export class createMessageChannelDto{
    @IsNotEmpty()
    channel_id:string
    
    @IsNotEmpty()
    user_id:string
    
    @IsNotEmpty()
    content:string
}