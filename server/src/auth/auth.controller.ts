import { Body, Controller, Get, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { GoogleGuard } from './Guards/GoogleGuard';
import passport, { Profile } from 'passport';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './Strategys/GoogleStrategy';
import { AuthGuard } from '@nestjs/passport';
import { AuthDto } from './dto/auth.dto';
import { redirect } from 'react-router-dom';
import { User } from './decorator/user-decorator';
import { FtGurad } from './Guards/42Gurad';
import { GithubGuard } from './Guards/GithubGuard';
import { profile } from 'console';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService)
  {
  }

    @Post('signin')
    async handleSignin(@Body() body: AuthDto, @Res() response: Response)
    {                 
        console.log(body);
        const user = await this.authService.signin(body);
        console.log(user);
        if (!user)
            return response.status(400).json({msg: 'Invalid Credencial'});
        else 
            return response.status(200).json({msg: 'ok'});
    }
    @Get('google/login')
    @UseGuards(GoogleGuard)
   async handleGoogleLogin()
    {
        return ;
    }

    @Get('42/login')
    @UseGuards(FtGurad)
    handle42login()
    {
        return ({msg: "42 login"})
    }

    @Get('/42/redirect')
    @UseGuards(FtGurad)
    async handleRedirectFt(@User() user : Profile, @Request() request, @Res() response: Response)
    {
        const userData  = this.authService.extract42UserData(user);
        const access_token =  await this.authService.login(userData, response);
        console.log(access_token);
        response.cookie('access_token', access_token);
        if (userData.password === '' || userData.email === '')
            return response.redirect("http://127.0.0.1:3000");
        response.redirect("http://127.0.0.1:3000/profile");
    }

    @Get('google/redirect')
    @UseGuards(GoogleGuard)
    async handleRedirectGoogle(@User() user : Profile, @Req() request, @Res() response)
    {
        const userData  = this.authService.extractGoogleUserData(user);
        const access_token =  await this.authService.login(userData, response);
        console.log(access_token);
        response.cookie('access_token', access_token);
        if (userData.password === '' || userData.email === '')
            return response.redirect("http://127.0.0.1:3000");
        response.redirect("http://127.0.0.1:3000/profile");
        
    }

    @Get('github/login')
    @UseGuards(GithubGuard)
    handleGithublogin()
    {
        return ({msg: "Github login"})
    }
    @Get('/github/redirect')
    @UseGuards(GithubGuard)
    async handleRedirectGithub(@User() user :Profile , @Request() request, @Res() response)
    {
        // const {login?, avatar_url?, email?, name } = user;
        // const userData : CreateUserDto ={
        //     email: user?.email,
        //     username: login,
        //     avatar: avatar_url,
        //     cover: "",
        //     password: ""
        // }
        console.log("github ",user);
        response.redirect("http://127.0.0.1:3000/profile");
    }
}