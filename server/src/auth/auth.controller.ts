import { Controller, Get, Req, Request, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './utils/GoogleGuard';
import passport from 'passport';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { AuthGuard } from '@nestjs/passport';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService)
  {

  }

    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    handleLogin()
    {
        return ;
        // passport.authenticate('google', {
        //     scope: ['profile']
        // })
        // return {msg: "lGoogle authentification"}
    }

    @Get('42/login')
    handle42login()
    {
        return ({msg: "42 login"})
    }
 // redirect fo 42 get request

    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    handleRedirect(@Request() request)
    {
        // this.authService.signup(request);

        return {}
    }
}