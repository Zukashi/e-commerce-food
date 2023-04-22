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
import { UserService } from '../../user/user.service';
import { VendorService } from '../../vendor/vendor.service';
export interface ReqWithUser extends Request {
  user: User;
}
@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly vendorService: VendorService,
  ) {}

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
        async (err: unknown, test: JwtPayload) => {
          console.log(test, 666);
          request.role = test;
          if (!err) {
            return true;
          } else {
            console.log(123);
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
