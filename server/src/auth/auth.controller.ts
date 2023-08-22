import { Body, Controller, Get, Post, Req, Request, Res, Response, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './utils/GoogleGuard';
import passport from 'passport';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { AuthGuard } from '@nestjs/passport';
import { AuthDto } from './dto/auth.dto';
import { redirect } from 'react-router-dom';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService)
  {
  }

    @Post('signin')
    async handleSignin(@Body() body: AuthDto, @Response() res)
    {                 
        console.log(body);
        const user = await this.authService.signin(body);
        console.log(user);
        
        if (!user)
            res.status(400).json({msg: 'Invalid Credencial'});
        else 
            return res.status(200).json(user);
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
        // return this.authService.signup(request);
        
        
    }
}