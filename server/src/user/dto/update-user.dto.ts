import { IsNotEmpty, IsOptional, IsStrongPassword } from "class-validator"

export class UpdateUserDto {
    @IsNotEmpty()
    @IsOptional()
    username:string

    @IsStrongPassword()
    @IsNotEmpty()
    @IsOptional()
    Oldpassword:string

    @IsStrongPassword()
    @IsNotEmpty()
    @IsOptional()
    Newpassword:string

    @IsStrongPassword()
    @IsNotEmpty()
    @IsOptional()
    Confirmedpassword:string
}