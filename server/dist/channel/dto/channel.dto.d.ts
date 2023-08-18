import { Role, Type } from "@prisma/client";
export declare class CreateChannelDto {
    name: string;
    type: Type;
    password: string;
    owner_id: string;
}
export declare class createMessageChannelDto {
    channel_id: string;
    user_id: string;
    content: string;
}
export declare class createUserRoleDto {
    userId: string;
    channelId: string;
    role: Role;
}
export declare class deleteUserChannelDto {
    user_id: string;
    channel_id: string;
}
export declare class updateUserRoleDto {
    owner_id: string;
    user_id: string;
    role: Role;
}
export declare class userBanMuteDto {
    banner_id: string;
    banned_id: string;
    channel_id: string;
}
