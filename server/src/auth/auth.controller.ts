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
import { Response } from 'express';
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

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Post('signin')
  async handleSignin(@Body() body: AuthDto, @Res() response: Response) {
    try {
      console.log(body);
      
      const data = await this.authService.signin(body);
      const {access_token, user} = data
      if (access_token === '')
        return response.status(400).json({ msg: 'Invalid Credencial' });
      console.log(access_token);
      response.cookie('access_token', access_token);
      return response
        .status(200)
        .json(user);
    
    } catch (e) {
      return response
        .status(400)
        .json({ msg: 'Invalid Credencial Error   ' + e.message });
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
      return ;
    }
    
    @Get('github/login')
    @UseGuards(GithubGuard)
    handleGithublogin() {
      return ;
    }
    
    @Get('/42/redirect')
    @UseGuards(FtGurad)
    async handleRedirectFt(
      @User() user: Profile,
    @Request() request,
    @Res() response,
  ) {
    try {

      const userData = this.authService.extract42UserData(user);
      const data = await this.authService.login(userData, response);
      console.log("data is " , data);
      const {access_token, userSearch} = data;
      response.cookie('access_token', access_token);
      if (!userSearch.password || !userSearch.email)
        return response.redirect('http://127.0.0.1:3000/login/complete');
      response.redirect('http://127.0.0.1:3000/profile');
    } catch (err) {
      response.status(400).json({ message: err.message });
    }
  }

  @Get('google/redirect')
  @UseGuards(GoogleGuard)
  async handleRedirectGoogle(
    @User() user: Profile,
    @Req() request,
    @Res() response,
  ) {
    try {
      const userData = this.authService.extractGoogleUserData(user);
      const data = await this.authService.login(userData, response);
      console.log("data is " , data);
      const {access_token, userSearch} = data;
      response.cookie('access_token', access_token);
      if (!userSearch.password || !userSearch.email)
        return response.redirect('http://127.0.0.1:3000/login/complete');
      response.redirect('http://127.0.0.1:3000/profile');
    } catch (err) {
      response.status(400).json({ message: err.message });
    }
  }

  @Get('/github/redirect')
  @UseGuards(GithubGuard)
  async handleRedirectGithub(
    @User() user: Profile,
    @Request() request,
    @Res() response,
  ) {
    try {
      const userData = this.authService.extractUserGithubData(user);
      const data = await this.authService.login(userData, response);
      console.log("data is " , data);
      
      const {access_token, userSearch} = data;
      response.cookie('access_token', access_token);
      if (!userSearch.password || !userSearch.email)
        return response.redirect('http://127.0.0.1:3000/login/complete');
      response.redirect('http://127.0.0.1:3000/profile');
    } catch (err) {
      response.status(400).json({ message: err.message });
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

  @Post('2fa/generate')
  @UseGuards(JwtAuthGuard)
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
