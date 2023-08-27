import {
  HttpException,
  HttpStatus,
  Injectable,
  Request,
  Res,
  UnauthorizedException,
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
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

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

    console.log('udrt', user);

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
    if (body.password === user.password) {
      return await this.extractJwtToken({
        id: user.id,
        username: user.username,
        setTwoFactorAuthenticationSecret: user.twoFactorAuthenticationSecret,
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
    console.log(user);

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
    console.log('user data', userData);

    return userData;
  }

  extractUserGithubData(user: any) : CreateUserDto {
    const { login,  avatar_url } = user._json;
    const userData = {
      email: 'zac.rabhi123@gmail.com',
      username: login + '12',
      avatar: avatar_url,
      cover: '',
      password: '',
    }
    return userData;
  }
  async extractJwtToken(playload: any) {
    const access_token = await this.jwtService.signAsync(playload);
    return access_token;
  }
  async login(
    user: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<String> {
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
            tfa: false,
          },
        });
        console.log('user id ', User.id);
        return await this.extractJwtToken({
          id: User.id,
          username: User.username,
        });
      } else {
        console.log("user ", user);
        const newUserId = await this.signup(user, res);
        
        const newUser = await this._user.findUserById(newUserId.id);

        return await this.extractJwtToken({
          id: newUser.id,
          username: newUser.username,
        });
      }
    } catch (err) {
      throw new UnauthorizedException('username already exist');

    }
  }
  async signup(user: CreateUserDto, @Res() res: Response) {
    console.log("signup ", user);
    
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
      throw new UnauthorizedException('username already exist');
    }
  }

  async generateTwoFactorAuthenticationSecret(user) {
    
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.id,
      'ft_transcendence',
      secret,
    );

    await this.setTwoFactorAuthenticationSecret(secret, user.id);

    return {
      secret,
      otpauthUrl,
    };
  }
  async setTwoFactorAuthenticationSecret(secret: string, userId: string) {
    await this._prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          twoFactorAuthenticationSecret: secret,
        },
      });
  }

  async turnOnTwoFactorAuthentication(userId: string) {
      await this._prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          tfa: true,
        },
      });
  }

  async generateQrCodeDataURL(otpAuthUrl: string) {
    return toDataURL(otpAuthUrl);
  }

   isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user) {
    console.log("token is ==> ", twoFactorAuthenticationCode, typeof twoFactorAuthenticationCode);
    console.log("token is ==> ", user.setTwoFactorAuthenticationSecret, typeof user.setTwoFactorAuthenticationSecret);
    const optionsVerify = {
      token: twoFactorAuthenticationCode,
       secret: "KRZWSDKKCZ3EWMZN"
    }
    try{
    return authenticator.verify(optionsVerify);
  }catch(err){
    console.log("error: ", err);

  }
  }

  // async loginWith2fa(userWithoutPsw) 
  //     {
  //       const payload = {
  //         email: userWithoutPsw.id,
  //         isTwoFactorAuthenticationEnabled: !!userWithoutPsw.isTwoFactorAuthenticationEnabled,
  //         tfa: true,
  //       };
    
  //       return {
  //         id: payload.email,
  //         access_token: this.jwtService.signAsync(payload),
  //       };
  //     }

}

