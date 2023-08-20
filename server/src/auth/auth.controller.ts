import { Controller, Get, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './Guards';

@Controller('/api/auth')
export class AuthController {

    @Get('google/login')
    // @UseGuards(GoogleAuthGuard)
    handleLogin()
    {
        return {msg: "lGoogle authentification"}
    }
    @Get('google/redirect')
    handleRedirect()
    {
        return ({msg:"OK"})
    }
}

