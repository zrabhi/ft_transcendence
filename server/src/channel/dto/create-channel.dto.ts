import { Type } from "@prisma/client"
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