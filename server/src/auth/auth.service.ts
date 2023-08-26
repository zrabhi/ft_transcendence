import {
  HttpException,
  HttpStatus,
  Injectable,
  Request,
  Res,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { Profile } from 'passport';
import { User } from './decorator/user-decorator';

@Injectable()
export class AuthService {
  constructor(
    private _prisma: PrismaService,
    private readonly _user: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signin(body: AuthDto) {
    
    console.log(body);

    const user = await this._prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });
    
    console.log("udrt", user);

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: `Credentails does not exist, please create an account `,
        },
        HttpStatus.FORBIDDEN,
        {},
      );
    }
    if (body.password === user.password) 
    {
      return await this.extractJwtToken({
        id: user.id,
        username: user.username,
      });
    }
    // const matches = await bcrypt.compare(body.password, user.password);
    // if (!matches) {
    //   return false;
    // }
    return false;
  }

  extractGoogleUserData(user: any): CreateUserDto {
    const { name, emails, photos } = user;
    console.log(name);
    console.log(emails);
    console.log(photos);
    const userData: CreateUserDto = {
      email: emails[0].value,
      username: name.givenName,
      avatar: photos[0].value,
      cover: '',
      password: '',
    };
    return userData;
  }

  extract42UserData(user: any) {
    const { login, email, image } = user._json;
    console.log(user._json.email);
    
    console.log(user._json.image.link);
    
    const userData: CreateUserDto = {
      email: email,
      username: login,
      avatar: user._json.image.link,
      cover: '',
      password: '',
    };
    console.log("user data", userData);
    
    return userData;
  }

  extractUserGithubData(user:any)
  {
        console.log(user);
        
  }
  async extractJwtToken(playload: any) {
    const access_token  = await this.jwtService.signAsync(playload);
    return access_token;
  }
    async login(user : CreateUserDto, @Res({ passthrough: true }) res: Response) : Promise<String> {
    console.log('UserData: ', user);

    try {
      const user_search = await this._prisma.user.findFirst({
        where: {
          email: user.email,
        },
      });
      if (user_search) {
        const User = await this._prisma.user.update({
          where: {
            id: user_search.id,
          },
          data: {
            status: 'ONLINE',
          },
        });
        console.log('user id ', User.id);
        return await this.extractJwtToken({
            id: User.id,
            username: User.username,
          });
      } else {
        
        const newUserId = await this.signup(user, res);
        const newUser = await this._user.findUserById(newUserId.id);

        return await this.extractJwtToken({
            id: newUser.id,
            username: newUser.username,
          });
      }
    } catch (err) {
      console.log('catch error: ', err);
      res.status(400);
    }
  }
  async signup(user: CreateUserDto, @Res() res: Response) {
    try {
      return await this._prisma.user.create({
        data: {
          email: user.email,
          username: user.username,
          achievement: {
            create: {
              accountCreationAchie: true,
            },
          },
        },
        select: {
          id: true,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
}
