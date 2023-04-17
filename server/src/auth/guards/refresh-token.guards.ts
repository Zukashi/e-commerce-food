import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../../user/entities/user.entity';
const jwt = require('jsonwebtoken');
import { Request } from 'express';
export interface ReqWithUser extends Request {
  user: User;
}
@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    //verify jwt
    const checkJwt = () => {
      jwt.verify(
        request.cookies.refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err: any, user: User) => {
          if (!err) {
            //assign user to req user for request using access tokens
            request['user'] = user;
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
