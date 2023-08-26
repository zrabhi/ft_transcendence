import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
  
  @Injectable()
  export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private config: ConfigService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      // console.log(request);
      
      if (!token) {
        console.log("error " , token);
        throw new UnauthorizedException();
      }
      console.log(process.env.JWT_SECRET);
      
      try {
        const payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: process.env.JWT_SECRET,
          }
        );
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request['user'] = payload;
      } catch(err) {
        console.log("heree" );
        
        throw new UnauthorizedException();
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const token = request.headers.cookie.split('=')[1] || undefined;
      console.log("extracted token ", token);
        
      return token 
      // const [type, token] = request.headers.authorization?.split(' ') ?? [];
      // console.log("request : ", request.headers);
      
      // console.log("type  ", type, "token ", token);
      
      // return type === 'Bearer' ? token : undefined;
    }
  }