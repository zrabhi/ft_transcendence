import { Profile } from 'passport-google-oauth20';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Profile => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const UserInfo = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user
    return user;
  },
);
