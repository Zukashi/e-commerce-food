import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Vendor } from '../../vendor/entities/vendor.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export interface ReqWithUser extends Request {
  user: Vendor | User;
}
@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: ReqWithUser, res: Response, next: NextFunction) {
    const userRefreshCookie = req.cookies.Refresh; // get user id from session
    console.log(userRefreshCookie, 'test');
    const decoded = this.jwtService.verify(userRefreshCookie, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
    });
    const user = await this.userRepository.findOneBy({
      id: decoded.userId,
    });
    if (user) {
      req.user = user;
      next();
    }
    const user2 = await this.vendorRepository.findOneBy({
      id: decoded.userId,
    });
    if (user2?.refresh_token === userRefreshCookie && user2) {
      req.user = user2;
      next();
    }
  }
}
