import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
const jwt = require('jsonwebtoken');
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from 'jsonwebtoken';
export interface ReqWithUser extends Request {
  user: User;
}
@Injectable()
export class RefreshTokenGuard implements CanActivate {
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
    //verify jwt
    const checkJwt = () => {
      jwt.verify(
        request.cookies.refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err: unknown, test: JwtPayload) => {
          console.log(test);
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
