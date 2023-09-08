import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {Response} from 'Express'
import { GoogleGuard } from './Guards/GoogleGuard';
import passport, { Profile } from 'passport';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './Strategys/GoogleStrategy';
import { AuthDto } from './dto/auth.dto';
import { User } from './decorator/user-decorator';
import { FtGurad } from './Guards/42Gurad';
import { GithubGuard } from './Guards/GithubGuard';
import { profile } from 'console';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtAuthGuard } from './Guards/AuthGurad';
import { SeassionGuard } from './Guards/SeassionGuard';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from '@nestjs/passport';
const HOSTNAME : string = process.env.HOSTNAME;
const LOGIN: string = process.env.HOSTNAME + process.env.LOGIN;
const COMPLETE : string = process.env.HOSTNAME + process.env.COMPLETE;
const PROFILE : string = process.env.HOSTNAME +  process.env.PROFILE;


@Controller('/api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}


  @Post('signin')
  async handleSignin(@Body() body: AuthDto, @Res() response: Response) {
    try {

      const data = await this.authService.signin(body);
      const {matches, user} = data
      if (matches)
      {
        const  access_token =  await this.authService.extractJwtToken({
          id: user.id,
          username: user.username,
          setTwoFactorAuthenticationSecret: user.twoFactorAuthenticationSecret,
        });
        response.cookie('acces_token', access_token);
        return response.status(200).json(user);
    }
    return response.status(400).json({ msg: 'Invalid Credencial' });
      // response.end("ok");
      } catch (e) {
      return response
        .status(400)
        .json({ msg: 'Invalid Credencial Error '});
    }
  }

  @Get('google/login')
  @UseGuards(GoogleGuard)
  async handleGoogleLogin() {
    return;
  }

  @Get('42/login')
  @UseGuards(FtGurad)
  handle42login() {
    return;
  }


  @Get('/42/redirect')
  @UseGuards(FtGurad)
  async handleRedirectFt(
    @User() user,
    @Res() response,
  ) {
    try {      
      console.log("user auth", user); 
      
      const access_token = await this.authService.extractJwtToken(
      {
        id : user.id,
        username: user.username,
        setTwoFactorAuthenticationSecret: user.twoFactorAuthenticationSecret,
      })
      response.cookie('access_token', access_token);
      if (!user.password)
          return response.redirect(COMPLETE);
      response.redirect(PROFILE);
    } catch (err) {
      response.redirect(LOGIN);
    }
  }

  @Get('google/redirect')
  @UseGuards(GoogleGuard)
  async handleRedirectGoogle(
    @User() user,
    @Res() response,
  ) {
    try {      
      const access_token = await this.authService.extractJwtToken(
          {
            id : user.id,
            username: user.username,
            setTwoFactorAuthenticationSecret: user.twoFactorAuthenticationSecret,
          })
      response.cookie('access_token', access_token);
      if (!user.password)
          return response.redirect(COMPLETE);
      response.redirect(PROFILE);
    } catch (err) {
      response.redirect(LOGIN);
    }
  }

  @Post('2fa/trun-on')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFactorAuthentication(@Req() request, @Body() body) {
    const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
      body.twoFactorAuthenticationCode,
      request.user,
    );
    console.log(isCodeValid);
    
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.authService.turnOnTwoFactorAuthentication(request.user.id);
  }

  // @Post('2fa/authenticate')
  // @HttpCode(200)
  // @UseGuards(JwtAuthGuard)
  // async authenticate(@Request() request, @Body() body) {

  //   try {
  //     const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
  //       body.twoFactorAuthentication,
  //       request.user,
  //     );

  //     if (!isCodeValid) {
  //       throw new UnauthorizedException('Wrong authentication code');
  //     }

  //     return this.authService.loginWith2fa(request.user);
  //   } catch (error) {
  //   }
  // }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/generate')
  async register(@Res() response, @Request() request) {
    const { otpauthUrl } =
      await this.authService.generateTwoFactorAuthenticationSecret(
        request.user,
      );

    return response.json(
      await this.authService.generateQrCodeDataURL(otpauthUrl),
    );
  }
}
