import { IsNotEmpty, IsOptional, IsStrongPassword } from "class-validator";
import { Type } from "@prisma/client";

export class createChannelDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    type: Type

    @IsStrongPassword()
    @IsNotEmpty()
    @IsOptional()
    password?: string

    @IsNotEmpty()
    owner_id: string
}