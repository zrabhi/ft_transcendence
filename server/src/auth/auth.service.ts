import { HttpException, HttpStatus, Injectable, Request } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import { AuthDto } from "./dto/auth.dto";
import { UserService } from "src/user/user.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";


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
        
       const matches =  await bcrypt.compare(body.password, user.password)
       if (!matches)
       {
        
            return (false);
       }
     return (user);
    }

    async login(user, res)
    {
        const { name, emails, photos } = user;
        console.log(name);
        console.log(emails);
        console.log(photos);
        const userData: CreateUserDto= {
            email: emails[0].value,
            username: name.givenName,
            // firstName: name.givenName,
            // lastName: name.familyName,
            avatar: photos[0].value,
            cover: "",
            password: ""
        };
       console.log(userData);
       
       
       const user_search = await this._prisma.user.findFirst({
        where: {
            email: userData.email,
            },
        });
        if (user_search)
        {
            const user_update = await this._prisma.user.update({
                where: {
                    id: user_search.id,
                  },
                data : {
                    status: 'OFFLINE',
                },
            });
            return user_update
        } 
        else
            { 
                const neUser = this.signup(userData, res);
                console.log("new user in db", neUser);
                
                // throw new HttpException({
                //         status: HttpStatus.FORBIDDEN,
                //         error: `User must Singup `,
                //     }, HttpStatus.FORBIDDEN, {
                //     })
            }
            res.status(400);
    }

    async signup(user: CreateUserDto, res)
    {
        try {
            return await this._prisma.user.create({
                data:
                {
                    email:user.email,
                    username:user.username,
                    achievement:{
                        create:{
                            accountCreationAchie:true,
                        }
                    }
                },
                select: {
                    id: true,
                }
            });
            
        } catch (err) {console.log(err);
        }
    }
}