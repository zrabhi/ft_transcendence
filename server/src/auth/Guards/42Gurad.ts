import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class FtGurad extends AuthGuard('42') {
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const activate: boolean = (await super.canActivate(context)) as boolean;
//     const request: Request = context.switchToHttp().getRequest();
//     await super.logIn(request);
//     return activate;
//   }
}
