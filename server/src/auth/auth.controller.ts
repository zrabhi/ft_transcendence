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
import { Response, response } from 'Express';
import { GoogleGuard } from './Guards/GoogleGuard';
import passport, { Profile } from 'passport';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './Strategys/GoogleStrategy';
import { AuthDto } from './dto/auth.dto';
import { User } from './decorator/user-decorator';
import { FtGurad } from './Guards/42Gurad';
import { GithubGuard } from './Guards/GithubGuard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtAuthGuard } from './Guards/AuthGurad';
import { SeassionGuard } from './Guards/SeassionGuard';
import { UserService } from 'src/user/user.service';
import { turnOnGuard } from './Guards/turnOnGurad';

const HOSTNAME: string = process.env.HOSTNAME;
const LOGIN: string = process.env.HOSTNAME + process.env.LOGIN;
const COMPLETE: string = process.env.HOSTNAME + process.env.COMPLETE;
const PROFILE: string = process.env.HOSTNAME + process.env.PROFILE;
const TFALOGIN: string = process.env.HOSTNAME + process.env.TFALOGIN;

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
      const { matches, user } = data;
      if (matches) {
        const access_token = await this.authService.extractJwtToken({
          id: user.id,
          username: user.username,
          setTwoFactorAuthenticationSecret: user.twoFactorAuthenticationSecret,
        });
        response.cookie('access_token', access_token);
        return response.status(200).json(user);
      }
      return response.status(400).json({ msg: 'Invalid Credencial' });
    } catch (e) {
      return response.status(400).json({ msg: 'Invalid Credencial Error ' });
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
  async handleRedirectFt(@User() user, @Res() response) {
    try {
      const access_token = await this.authService.extractJwtToken({
        id: user.id,
        username: user.username,
        setTwoFactorAuthenticationSecret: user.twoFactorAuthenticationSecret,
      });
      response.cookie('access_token', access_token);
      if (!user.password) return response.redirect(COMPLETE);
      else if (user.tfa) return response.redirect(TFALOGIN);
      return response.redirect(PROFILE);
    } catch (err) {
      // console.log("errrrr => ",err);
    }
  }

  @Get('google/redirect')
  @UseGuards(GoogleGuard)
  async handleRedirectGoogle(@User() user, @Res() response: Response) {
    try {
      const access_token = await this.authService.extractJwtToken({
        id: user.id,
        username: user.username,
        setTwoFactorAuthenticationSecret: user.twoFactorAuthenticationSecret,
      });
      response.cookie('access_token', access_token);
      if (!user.password) return response.redirect(COMPLETE);
      if (user.tfa) return response.redirect(TFALOGIN);
      return response.redirect(PROFILE);
    } catch (err) {
      response.redirect(LOGIN);
    }
  }

  @Post('2fa/turn-on')
  @HttpCode(200)
  @UseGuards(turnOnGuard)
  async turnOnTwoFactorAuthentication(
    @Req() request,
    @Body() body,
    @Res() res,
  ) {
    const isCodeValid =
      await this.authService.isTwoFactorAuthenticationCodeValid(
        body.twoFactorAuthenticationCode,
        request.user.id,
      );

    if (!isCodeValid)
      return res.status(400).json('Wrong authentication code');
    await this.authService.turnOnTwoFactorAuthentication(request.user.id);
    res.status(200).json('ok');
  }

  @Post('2fa/authenticate')
  @HttpCode(200)
  @UseGuards(turnOnGuard)
  async authenticate(@Req() request, @Res() response, @Body() body) {
    try {
      const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
        body.twoFactorAuthenticationCode,
        request.user.id,
      );

      if (!isCodeValid)
        return response.status(400).json('Wrong authentication code');
      await this.authService.setTfaVeridied(request.user.id);
    } catch (error) {}
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/generate')
  async register(@Res() response, @Req() request) {
    const { otpauthUrl } =
      await this.authService.generateTwoFactorAuthenticationSecret(
        request.user,
      );
    return response.json(
      await this.authService.generateQrCodeDataURL(otpauthUrl),
    );
  }
  
}
