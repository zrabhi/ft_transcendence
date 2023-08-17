import { Role } from "@prisma/client"
import { IsNotEmpty } from "class-validator"

export class updateUserRoleDto{
    @IsNotEmpty()
    owner_id:string

    @IsNotEmpty()
    user_id:string

    @IsNotEmpty()
    role:Role
}