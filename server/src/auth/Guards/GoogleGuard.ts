import { ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { request } from "http";

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google')
{
   async canActivate(context: ExecutionContext): Promise<boolean> 
    {
        const activat: boolean   = (await super.canActivate(context)) as boolean;
        const request :Request = context.switchToHttp().getRequest();
            
        await super.logIn(request);
    
        // catch(err)
        // {
        // }
        
        
        return activat;
    }
}
@Injectable()
export class  GoogleGuard extends AuthGuard('google') {}
