import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../user.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userRefreshCookie = req.cookies.refresh_cookie; // get user id from session
    const user = await this.userService.findOne({
      value: userRefreshCookie,
      field: 'refresh_cookie',
    });
    console.log(888);
    if (!user) throw new UnauthorizedException();
    req.user = user;
    next();
  }
}
