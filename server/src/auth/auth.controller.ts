import { Body, Controller, Get, Req, Request, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './utils/GoogleGuard';
import passport from 'passport';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { AuthGuard } from '@nestjs/passport';
import { AuthDto } from './dto/auth.dto';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService)
  {
  }

    @Get('signin')
    async handleSignin(@Body() body: AuthDto)
    {                 
        console.log(body);
        const user = await this.authService.signin(body);
    }
    @Get('google/login')
    @UseGuards(AuthGuard('google'))
    handleGoogleLogin()
    {
        return {msg :"google auth"}
    }

    @Get('42/login')
    handle42login()
    {
        return ({msg: "42 login"})
    }
 // redirect fo 42 get request

    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async handleRedirect(@Req() request)
    {
        this.authService.signup(request);
        return {}
    }
}