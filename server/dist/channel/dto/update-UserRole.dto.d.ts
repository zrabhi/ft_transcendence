import { Role } from "@prisma/client";
export declare class updateUserRoleDto {
    owner_id: string;
    user_id: string;
    role: Role;
}
