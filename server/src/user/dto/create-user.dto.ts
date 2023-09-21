import { IsAlphanumeric, IsEmail, IsNotEmpty, IsOptional, IsStrongPassword, MaxLength, MinLength } from "class-validator"


export class CreateUserDto{
    @IsOptional()
    @IsNotEmpty()
    @IsEmail()
    email:string
    
    @IsOptional()
    avatar:string
    
    @IsOptional()
    cover: string
    
    @MaxLength(20, {message: " The Username is too High."})
    @MinLength(6, {message: " The Username is too low."})
    @IsNotEmpty()
    username:string

    @IsStrongPassword()
    @IsNotEmpty()
    @IsOptional()
    password: string
}