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
      // console.log(request);
      
      if (!token) {
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
        
        if (payload)
                console.log("truee\n\n");
                
        
        request['user'] = payload;
      } catch(err) {
        // response.redirect("http://127.0.0.1:3000/login");
        console.log("heree" );
        
        // throw new UnauthorizedException();
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const token = request.headers.cookie?.split('=')[1] || undefined;
      console.log("extracted token ", token);
        
      return token 
      // const [type, token] = request.headers.authorization?.split(' ') ?? [];
      // console.log("request : ", request.headers);
      
      // console.log("type  ", type, "token ", token);
      
      // return type === 'Bearer' ? token : undefined;
    }
  }