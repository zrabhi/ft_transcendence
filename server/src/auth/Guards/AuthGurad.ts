import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private config: ConfigService, private userService: UserService) {}


  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // const response = context.switchToHttp().getResponse();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      console.log("token", token);
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      // console.log(payload);
      request['user'] = payload;
      const user = await this.userService.findUserById(request.user.id);
      if (user.tfa && !user.isTfaVerified)
            throw new UnauthorizedException();
    } catch (err) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {

    const token: any = request?.headers?.cookie?.split(';').reduce(
      (cookies, cookie) => {
          const [name, val] = cookie.split('=').map(c => c.trim());
          cookies[name] = val;
          return cookies;
      }, {});
    // console.log(token);

    return token.access_token;
  }
}
