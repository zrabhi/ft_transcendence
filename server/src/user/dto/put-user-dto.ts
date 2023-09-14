import { IsAlphanumeric, IsEmail, IsNotEmpty, IsOptional, IsStrongPassword, MaxLength, MinLength } from "class-validator"

export class PutUserDto{
    
    
    @IsOptional()
    avatar:string
    
    @IsOptional()
    cover: string
    
    @MaxLength(20, {message: " The Username is too High."})
    @MinLength(4, {message: " The Username is too low."})
    @IsNotEmpty()
    username:string

    @IsOptional()
    discord: string

    @IsOptional()
    twitter: string
    
    @IsStrongPassword()
    @IsNotEmpty()
    @IsOptional()
    password: string
}

export class FileUserDto {

    @IsOptional()
    avatar: string

    @IsOptional()
    cover: string
}