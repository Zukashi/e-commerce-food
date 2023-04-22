import {
  Injectable,
  NestMiddleware,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../user.service';
import { VendorService } from '../../vendor/vendor.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly vendorService: VendorService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userRefreshCookie = req.cookies.refreshToken; // get user id from session
    console.log(userRefreshCookie, 'test');
    const user = await this.userService.findOne({
      value: userRefreshCookie,
      field: 'refresh_token',
    });
    if (user?.refresh_token !== userRefreshCookie && user?.id) {
      throw new NotFoundException();
    }
    if (user?.refresh_token !== userRefreshCookie) {
      const user = await this.vendorService.findOne({
        value: userRefreshCookie,
        field: 'refresh_token',
      });
      console.log(user);
      if (!user) throw new NotFoundException();
      req.user = user;
      next();
    }
    next();
  }
}
