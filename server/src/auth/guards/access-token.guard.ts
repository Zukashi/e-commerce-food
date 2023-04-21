import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { User } from '../../user/entities/user.entity';
const jwt = require('jsonwebtoken');

import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const checkJwt = () => {
      jwt.verify(
        request.cookies.accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err: any, user: User) => {
          if (!err) {
            return true;
          } else {
            throw new UnauthorizedException();
          }
        },
      );
    };
    try {
      await checkJwt();
      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
