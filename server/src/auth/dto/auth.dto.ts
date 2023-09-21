import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class AuthDto 
{
    @IsEmail()
    @IsString()
    email: string;

    @IsStrongPassword()
    password: string;
}