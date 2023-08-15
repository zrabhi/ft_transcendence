import { IsNotEmpty } from "class-validator"

export class deleteUserChannelDto{
    @IsNotEmpty()
    user_id:string

    @IsNotEmpty()
    channel_id:string
}