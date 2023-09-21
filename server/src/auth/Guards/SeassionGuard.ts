import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
  
  @Injectable()
  export class SeassionGuard implements CanActivate {
    constructor(private jwtService: JwtService, private config: ConfigService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException();
      }
      try {
        const payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: process.env.JWT_SECRET,
          }
        );
        
        if (payload)
        
        request['user'] = payload;
      } catch(err) {
        // response.redirect("http://127.0.0.1:3000/login");
        // throw new UnauthorizedException();
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const token = request.headers.cookie?.split('=')[1] || undefined;
      return token 
      // const [type, token] = request.headers.authorization?.split(' ') ?? [];
      
      // conole.log("type  ", type, "token ", token);
      
      // return type === 'Bearer' ? token : undefined;
    }
  }