import { Injectable, Request } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class AuthService 
{
    constructor(private _prismaService: PrismaService)
    {
    }

    async signup(@Request() user)
    {
        console.log("user rq ", user);
           
    }
}