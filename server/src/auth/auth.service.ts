import { HttpException, HttpStatus, Injectable, Request } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import { AuthDto } from "./dto/auth.dto";
import { UserService } from "src/user/user.service";


@Injectable()
export class AuthService 
{
    constructor(private _prisma: PrismaService, private readonly _user: UserService,)
    {
    }

    async signin(body: AuthDto)
    {

        console.log(body);
        
        // need seasion and jwt authentication
        const user = await this._prisma.user.findFirst({
            where: {
                email: body.email,
            },
        });

        if (!user)
        {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: `Invalide Credentails `,
            }, HttpStatus.FORBIDDEN, {
            })
        }   

       const matches =  await bcrypt.compare(user.password, body.password)
       if (!matches)
       {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: `password does not match`,
            }, HttpStatus.FORBIDDEN, {
            })
       }
      return (user);
    }
    async signup(@Request() user)
    {
        console.log("user rq ", user);
    }
}