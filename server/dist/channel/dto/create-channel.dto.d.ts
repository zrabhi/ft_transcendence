import { Type } from "@prisma/client";
export declare class CreateChannelDto {
    name: string;
    type: Type;
    password: string;
    owner_id: string;
}
